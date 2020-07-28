import Knex from 'knex'

const dbFile = process.env.dbFile || './data.db'

const dateOffset = 1000*60*5 // only count between 5 minutes

const dbConfig = {
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
    },
    development: {
        client: 'sqlite3',
        connection: {
            filename: dbFile
        },
        useNullAsDefault: true
    }
}

const usedConfig = dbConfig[process.env.NODE_ENV || 'development']

const knex = Knex(usedConfig)

class Database{
    constructor() {
        this.init()
    }

    init = async ()=>{
        const hasTable = await knex.schema.hasTable('users')
        if(!hasTable){
            this.makeTable()
        }
    }

    makeTable = async() => {
        await knex.schema.createTable('users', (table)=>{
            table.string('userid')
            table.string('username')
            table.text('password')
            table.integer('score')
            table.timestamp('lasttime')
        })
    }

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
        const user = await this.getUser(username)
        if(user && user.userid !== userid){
            return false
        }
        await knex('users').where({userid: userid}).update({username: username}).then()
        return true
    }

    addScore = async (userid) => {
        const user = await this.getUserByID(userid)
        if(user){
            await knex('users').where({userid: userid}).update({lasttime: Date.now()}).then()
            if(user.lasttime+dateOffset < Date.now()){
                console.log("Adding score: "+userid)
                if(!user.score){
                    user.score = 0
                }
                await knex('users').where({userid: userid}).update({score: user.score+1}).then()
            }
            return true
        }else{
            return false
        }
    }
}

export default new Database()