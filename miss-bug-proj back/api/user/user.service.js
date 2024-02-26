import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js'
import mongodb from 'mongodb'
const { ObjectId } = mongodb
const collectionName = 'user'

export const userService = {
    query,
    getById,
    getByUsername,
    remove,
    save
}

async function query() {
    try {
        const collection = await dbService.getCollection(collectionName)
        var users = await collection.find().toArray()
        users = users.map(user => {
            delete user.password
            user.createdAt = new ObjectId(user._id).getTimestamp().getTime()
            return user
        })
        return users
    } catch (err) {
        loggerService.error('Had problem getting user...')
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection(collectionName)
        var user = await collection.findOne({_id: new ObjectId(userId)})
        delete user.password
        user.createdAt = new ObjectId(userId).getTimestamp().getTime()
        return user
    } catch (err) {
        loggerService.error(`Had problem getting user ${userId}...`)
        throw err
    }
}

async function getByUsername(userUsername) {
    try {
        const collection = await dbService.getCollection(collectionName)
        var user = await collection.findOne({username: userUsername})
        delete user.password
        user.createdAt = new ObjectId(user.id).getTimestamp().getTime()
        return user
    } catch (err) {
        loggerService.error(`Had problem getting user ${userUsername}...`)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection(collectionName)
        var user = await collection.deleteOne({_id: new ObjectId(userId)})
    } catch (err) {
        loggerService.error(`Had problem removing user ${userId}...`)
        throw err
    }
}

async function save(userToSave) {
    try {
        const collection = await dbService.getCollection(collectionName)
        if(userToSave._id) {
            userToSave._id = new ObjectId(userToSave._id)
            await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
        } else {
            userToSave.isAdmin = false
            userToSave.score = 1000
            await collection.insertOne(userToSave)
        }

        return userToSave
    } catch (err) {
        loggerService.error(`Had problem saving user ${userId}...`)
        throw err
    }
}

function _makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}