import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'
import mongodb from 'mongodb'
const { ObjectId } = mongodb
const collectionName = 'msg'

export const msgService = {
    query,
    getById,
    remove,
    save
}

async function query() { // need to fix
    try {
        const collection = await dbService.getCollection(collectionName)
        var msgs = await collection.aggregate([{
            $lookup: {
                from: 'user',
                localField: 'byUserId',
                foreignField: '_id',
                as: 'byUser'
            }
        },
        // {
        //     $unwind: '$byUser'
        // },
        {
            $lookup: {
                from: 'bug',
                localField: 'aboutBugId',
                foreignField: '_id',
                as: 'aboutBug'
            }
        },
        // {
        //     $unwind: '$aboutBug'
        // },
        {
            $project: {
                _id: true, // Include the '_id' field
                txt: true, // Include the 'txt' field
                byUser: true,
                aboutBug: true
                // "byUser._id": true, // Include 'byUser._id'
                // "byUser.fullname": true, // Include 'byUser.fullname'
                // "aboutBug._id": true, // Include 'aboutBug._id'
                // "aboutBug.title": true // Include 'aboutBug.title'
            }
        }
        ]).toArray()

        return msgs
    } catch (err) {
        loggerService.error('Had problem getting msgs...')
        throw err
    }
}

async function getById(msgId) {
    try {
        const collection = await dbService.getCollection(collectionName)
        var msg = await collection.findOne({_id: new ObjectId(msgId)})
        return msg
    } catch (err) {
        loggerService.error(`Had problem getting msg ${msgId}...`)
        throw err
    }
}

async function remove(msgId, loggedInUser) {
    try {
        const collection = await dbService.getCollection(collectionName)
        await collection.deleteOne({_id: new ObjectId(msgId)})
    } catch (err) {
        loggerService.error(`msgService[remove] msgId - ${msgId} , loggedInUser - ${JSON.stringify(loggedInUser)} : ${err.msg}`)
        throw err
    }
}

async function save(msgToSave, loggedInUser) {
    try {
        const collection = await dbService.getCollection(collectionName)
        msgToSave.byUserId = loggedInUser._id
        await collection.insertOne(msgToSave)

        return msgToSave
    } catch (err) {
        loggerService.error(`Had problem saving msg ${msgId}...`)
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
