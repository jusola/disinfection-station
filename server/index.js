import notp from 'notp'
import readline from 'readline'
import base32 from 'thirty-two'

const secret = '1234'
const period = 30
const window = 1

const base32secret = base32.encode(secret).toString('ascii')


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