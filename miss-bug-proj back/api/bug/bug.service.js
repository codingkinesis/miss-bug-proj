import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'
import mongodb from 'mongodb'
const { ObjectId } = mongodb
const collectionName = 'bug'

export const bugService = {
    query,
    getById,
    remove,
    save
}

async function query(filterBy) {
    try {
        const collection = await dbService.getCollection(collectionName)
        const criteria = _buildCriteria(filterBy)
        const bugs = await collection.find(criteria.filter).sort(criteria.sort).toArray();
        return bugs
    } catch (err) {
        loggerService.error('Had problem getting bugs...')
        throw err
    }
}

async function getById(bugId) {
    try {
        const collection = await dbService.getCollection(collectionName)
        console.log(collection)
        var bug = await collection.findOne({_id: new ObjectId(bugId)})
        return bug
    } catch (err) {
        loggerService.error(`Had problem getting bug ${bugId}...`)
        throw err
    }
}

async function remove(bugId, loggedInUser) {
    try {
        const collection = await dbService.getCollection(collectionName)
        var bug = await collection.findOne({_id: new ObjectId(bugId)})
        if(!loggedInUser.isAdmin && bug.owner._id !== loggedInUser._id) throw {msg:`Not your bug`, code: 403}

        await collection.deleteOne({_id: new ObjectId(bugId)})
    } catch (err) {
        loggerService.error(`bugService[remove] bugId - ${bugId} , loggedInUser - ${JSON.stringify(loggedInUser)} : ${err.msg}`)
        throw err
    }
}

async function save(bugToSave, loggedInUser) {
    try {
        const collection = await dbService.getCollection(collectionName)
        if(bugToSave._id) {
            var bug = await collection.findOne({_id: new ObjectId(bugToSave._id)})
            if(!loggedInUser.isAdmin && bug.owner._id !== loggedInUser._id) throw {msg:`Not your bug`, code: 403}
            
            bugToSave._id = new ObjectId(bugToSave._id)
            await collection.updateOne({_id: bugToSave._id}, {$set: bugToSave})
        } else {
            bugToSave.owner = { _id: loggedInUser._id, fullname: loggedInUser.fullname }
            await collection.insertOne(bugToSave)
        }

        return bugToSave
    } catch (err) {
        loggerService.error(`Had problem saving bug ${bugId}...`)
        throw err
    }
}


function _buildCriteria(filterBy) {
    // filter
    let filter = {}
    if(filterBy.title) {
        filter.title = { $regex: filterBy.title, $options: 'i' }
    }
    if(filterBy.severity) {
        filter.severity = { $gte: filterBy.severity }
    }
    if(filterBy.tags && filterBy.tags.length) {
        filter.tags = { $all: filterBy.tags }
    }
    
    // sort
    let sort = {}
    switch(filterBy.sortBy) {
        case 'title':
            sort.title = filterBy.sortDir
            //sort.options = { collation: { locale: 'en', strength: 2 } }
            break
        case 'createdAt':
            sort._id = filterBy.sortDir
            break
        default:
            sort[filterBy.sortBy] = filterBy.sortDir
    }
    
    return { filter, sort }
}

function _makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}
