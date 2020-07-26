import notp from 'notp'
import readline from 'readline'
import base32 from 'thirty-two'
import srp from 'secure-remote-password/server.js'
import expressSanitizer from 'express-sanitizer'
import expressValidator from 'express-validator'
import expressJWT from 'express-jwt'
import express from 'express'

const {check, validationResult} = expressValidator

const secret = '1234'
const period = 30
const window = 1

const base32secret = base32.encode(secret).toString('ascii')

const app = express()

var currentLogins = new Map()

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

rl.question('Code: ', (code)=>{
    console.log(code)
    const res = notp.totp.verify(code, base32secret, {time: period, window: window})
    console.log(res)
})

setInterval(()=>{
    const tok = notp.totp.gen(base32secret)
    // console.log(tok)
    
}, 5000)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressSanitizer())
app.use((req, res, next)=>{
    req.body = sanitize(req.body);
    next();
})

const JWTmw = expressJWT({
    secret: secret,
    algorithms: ['HS256']
});

// Login
// Give salt to client and get client public ephemeral key and username
app.post('/login/salt', [check('username').isString(), check('clientEphemeralPublic')], async (req, res)=>{ 
    const {clientEphemeralPublic, username} = req.body;
    try {
        const vErrors = validationResult(req)
        if(!vErrors.isEmpty()){
            console.log(vErrors)
            throw 'error.login.invalidquery'
        }
        const user = await db.collection("users").findOne({username: username}, {projection: {_id: 0}})
        if(user){
            const { verifier, salt, userid } = user
            const serverEphemeral = await srp.generateEphemeral(verifier)
            currentLogins.set(username, {clientEphemeralPublic, serverEphemeralSecret: serverEphemeral.secret, salt, verifier, userid})
            res.json({
                success: true,
                salt,
                serverEphemeralPublic: serverEphemeral.public
            })
        }else{
            // return some random salt here ... not yet implemented
            res.json({
                success: true,
                salt: '1234',
                serverEphemeralPublic: '1234'
            })
        }
    } catch (error) {
        if(typeof error === String){
            res.json({
                err: error,
                success: false
            })
        }else{
            console.log(error)
            res.json({
                err: 'error.login.invalidlogin',
                success: false
            })
        }
    }
})

// Give token and encryptionkey to client and create proof
app.post('/login/token', [check('username').isString(), check('clientEphemeralPublic')], async (req, res)=>{
    try {
        const vErrors = validationResult(req)
        if(!vErrors.isEmpty()){
            console.log(vErrors)
            throw 'error.login.invalidquery'
        }
        const {clientSessionProof, username} = req.body;
        const currentLogin = currentLogins.get(username)
        const serverEphemeralSecret = currentLogin.serverEphemeralSecret
        const clientEphemeralPublic = currentLogin.clientEphemeralPublic
        const salt = currentLogin.salt
        const verifier = currentLogin.verifier
        const userid = currentLogin.userid
        const serverSession = srp.deriveSession(serverEphemeralSecret, clientEphemeralPublic, salt, username, verifier, clientSessionProof)
        res.json({
            serverSessionProof: serverSession.proof,
            success: true,
            token: JWT.sign({ username, userid }, secret, { expiresIn: 129600 })
        })
    } catch (error) {
        if(typeof error === String){
            res.json({
                err: error,
                success: false
            })
        }else{
            console.log(error)
            res.json({
                err: 'error.servererror',
                success: false
            })
        }
    }
})