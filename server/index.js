import notp from 'notp'
import readline from 'readline'
import base32 from 'thirty-two'
import express from 'express'

import api from './api.js'

const secret = '1234'
const period = 30
const window = 1

const base32secret = base32.encode(secret).toString('ascii')

const app = express()

app.use('/api', api)

var currentLogins = new Map()

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


app.listen(process.env.PORT)

