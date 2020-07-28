import express from 'express'

import argon2 from 'argon2'
import expressJWT from 'express-jwt'
import expressValidator from 'express-validator'
import expressSanitizer from 'express-sanitizer'
import JWT from 'jsonwebtoken'

import notp from 'notp'
import base32 from 'thirty-two'

import db from './db.js'
import comm from './comm.js'

const {check, validationResult} = expressValidator

const base32secret = base32.encode(process.env.secret).toString('ascii')
const jwtSecret = process.env.jwtSecret

const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: true }))
router.use(expressSanitizer())
/*router.use((req, res, next)=>{
    req.body = sanitize(req.body);
    next();
})*/

const JWTmw = expressJWT({
    secret: jwtSecret,
    algorithms: ['HS256']
});


// headers
router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization')
    res.setHeader('Access-Control-Allow-Origin', '*')

    next()
});

router.post('/recover', [check('code')], async(req, res)=>{
    const id = comm.getCurrentUser()
    if(id){
        const result = notp.totp.verify(req.body.code, base32secret)
        if(result){
            const user = await db.getUserByID(id)
            if(!user){
                await db.createUser(id)
            }
            const token = signUser(id)
            res.json({
                success: true,
                token: token
            })
        }else{
            res.json({
                success: false,
                error: {
                    type: 'CredentialError',
                    translationKey: 'error.recover.invalidcode',
                    message: 'Invalid code'
                }
            })
        }
    }else{
        res.json({
            success: false,
            error: {
                type: 'CredentialError',
                translationKey: 'error.recover.nouser',
                message: 'No user found, are you close enough to the camera?'
            }
        })
    }
})

router.post('/login', [check('username').isString(), check('password').isString()], async (req, res)=>{ 
    try {
        const vErrors = validationResult(req)
        if(!vErrors.isEmpty()){
            console.log(vErrors)
            res.json({
                success: false,
                error: 'error.login.invalidquery',
                message: 'Invalid query'
            })
        }
        const {password, username} = req.body;
        
        const user = await db.getUser(username)

        if(await argon2.verify(user.password, password)){
            const token = signUser(user.userid)
            res.json({
                success: true,
                token: token
            })
        }else{
            res.json({
                success: false,
                error: 'error.login.invalidpassword',
                message: 'Wrong password'
            })
        }

    } catch (error) {
        res.json({
            success: false,
            error: {
                type: 'ServerError',
                translationKey: 'error.servererror',
                message: 'Internal server error'
            }
        })
    }
})

router.post('/configure', [check('username').isString(), check('password').isString()], JWTmw, async (req, res)=>{
    try {
        const vErrors = validationResult(req)
        if(!vErrors.isEmpty()){
            console.log(vErrors)
            res.json({
                success: false,
                error: {
                    type: 'QueryError',
                    translationKey: 'error.config.invalidquery',
                    message: 'Invalid request'
                }
            })
        }
        const {username, password} = req.body
        const userid = req.user.userid

        const hashed = await argon2.hash(password)
        
        const resUsername = await db.setUsername(userid, username)

        if(!resUsername){
            res.json({
                success: false,
                error: {
                    type: 'QueryError',
                    translationKey: 'error.config.usernamenotavailable',
                    message: 'Username not available'
                }
            })
            return
        }

        const resPassword = await db.setPassword(userid, hashed)

        if(!resPassword){
            res.json({
                success: false,
                error: 'error.servererror',
                message: 'Internal server error'
            })
            return
        }
        

        res.json({
            success: true
        })

    } catch (error) {
        res.json({
            success: false,
            error: 'error.servererror',
            message: 'Internal server error'
        })
    }
})

router.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        console.warn('Invalid token', err);
        res.send({
            success: false,
            err: 'error.invalidtoken'
        })
    }
    else {
        next(err)
    }
});

function signUser (userid){
    return JWT.sign({
        userid: userid
    }, jwtSecret)
}


export default router