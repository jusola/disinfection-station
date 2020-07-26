import express from 'express'

import argon2 from 'argon2'
import expressJWT from 'express-jwt'
import expressValidator from 'express-validator'
import expressSanitizer from 'express-sanitizer'
import JWT from 'jsonwebtoken'

import notp from 'notp'
import base32 from 'thirty-two'

import db from './db.js'

const {check, validationResult} = expressValidator

const base32secret = base32.encode(process.env.secret).toString('ascii')
const jwtSecret = process.env.jwtSecret

const router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(expressSanitizer())
router.use((req, res, next)=>{
    req.body = sanitize(req.body);
    next();
})

const JWTmw = expressJWT({
    secret: jwtSecret,
    algorithms: ['HS256']
});

// headers
router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization')
    if(process.env.NODE_ENV !== "development"){
        res.setHeader('Access-Control-Allow-Origin', 'https://ticked.jusola.xyz')
        res.setHeader('Vary', 'Origin')
    }else{
        res.setHeader('Access-Control-Allow-Origin', '*')
    }

    next();
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
                success: false
            })
        }
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
            error: 'error.servererror',
            message: 'Internal server error'
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
                error: 'error.configure.invalidquery',
                message: 'Invalid query'
            })
        }
        const {username, password} = req.body
        const userid = req.user.userid

        const hashed = await argon2.hash(password)
        
        await db.setUserName(userid, username)
        await db.setPassword(userid, hashed)

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