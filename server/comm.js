import express from 'express'
import router from './api'
import db from './db'
router = express.Router()

class InternalCommunication{
    constructor(){
        this.currentUser = null
    }

    getCurrentUser = () => {
        return this.currentUser
    }

    setCurrentUser = (newUser) => {
        this.currentUser = newUser
    }
}

const comm = new InternalCommunication

router.post('/setFace', (req, res)=>{
    try {
        if(req.body.transferToken === process.env.transferToken){
            comm.setCurrentUser(req.body.userid)
            res.sendStatus(200)
        }else{
            res.sendStatus(403)
        }  
    } catch (error) {
        res.sendStatus(500)
    }

})

router.post('/addScore', (req, res)=>{
    try {
        if(req.body.transferToken === process.env.transferToken){
            await db.addScore(req.body.userid)
            res.sendStatus(200)
        }else{
            res.sendStatus(403)
        }
    } catch (error) {
        res.sendStatus(500)
    }
})



export default comm