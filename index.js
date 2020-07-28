import express from 'express'

import api from './api.js'

import comm from './comm.js'

const app = express()



app.use('/api', api)
app.use('/comm', comm.router)


app.listen(process.env.PORT)