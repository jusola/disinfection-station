import Knex from 'knex'

const dbFile = process.env.dbFile || './data.db'

const dateOffset = 1000*60*5 // only count between 5 minutes

const knex = Knex({
    client: 'sqlite3',
    connection: {
        filename: dbFile
    },
    useNullAsDefault: true
})

class Database{
    getUser = async (username) => {
        const users = await knex('users').where({username: username}).select().then()
        if(users.length !== 1){
            return null
        }else{
            return users[0]
        }
    }

    getUserByID = async (userid) => {
        const users = await knex('users').where({userid: userid}).select().then()
        if(users.length !== 1){
            return null
        }else{
            return users[0]
        }
    }

    createUser = async (userid) => {
        const existingUser = await this.getUserByID(userid)
        if(!existingUser){
            await knex('users').insert({
                userid: userid
            })
            return true
        }else{
            return false
        }
    }

    setPassword = async (userid, password) => {
        await knex('users').where({userid: userid}).update({password: password}).then()
        return true
    }

    setUsername = async (userid, username) => {
        if(await this.getUser(username)){
            return false
        }else{
            await knex('users').where({userid: userid}).update({username: username}).then()
            return true
        }
    }

    addScore = async (userid) => {
        const user = await this.getUserByID(userid)
        if(user){
            await knex('users').where({userid: userid}).update({lasttime: Date.now()}).then()
            if(user.lasttime > Date.now()+dateOffset){
                await knex('users').where({userid: userid}).update({score: user.score+1}).then()
            }
            return true
        }else{
            return false
        }
    }
}

export default new Database()