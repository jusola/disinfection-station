import express from 'express'
import db from './db.js'
const router = express.Router()

class InternalCommunication{
    constructor(){
        this.currentUser = null
        this.router = router
    }

    getCurrentUser = () => {
        return this.currentUser
    }

    setCurrentUser = (newUser) => {
        this.currentUser = newUser
    }
}

const comm = new InternalCommunication

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.post('/setFace', async (req, res)=>{
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

router.post('/addScore', async (req, res)=>{
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