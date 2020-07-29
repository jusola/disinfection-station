import express from 'express'
import db from './db.js'
const router = express.Router()

class InternalCommunication{
    constructor(){
        this.currentUsers = new Map()
        this.router = router
    }

    getCurrentUser = (location) => {
        return this.currentUsers.get(location)
    }

    setCurrentUser = (userid, location) => {
        this.currentUsers.set(location, userid)
    }
}

const comm = new InternalCommunication

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization')
    res.setHeader('Access-Control-Allow-Origin', '*')

    next()
});

router.post('/setFace', async (req, res)=>{
    try {
        if(req.body.transferToken === process.env.transferToken){
            var location = req.body.location
            if(!location) location = 'unknown'
            comm.setCurrentUser(req.body.userid, location)
            res.sendStatus(200)
        }else{
            res.sendStatus(403)
        }  
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }

})

router.post('/addScore', async (req, res)=>{
    try {
        if(req.body.transferToken === process.env.transferToken){
            var location = req.body.location
            if(!location) location = 'unknown'
            await db.addScore(req.body.userid, location)
            res.sendStatus(200)
        }else{
            res.sendStatus(403)
        }
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})



export default comm