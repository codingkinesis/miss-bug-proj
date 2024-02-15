import fs from 'fs'
import { loggerService } from '../../services/logger.service.js'

export const bugService = {
    query,
    getById,
    remove,
    save
}

const bugsFilePath = './data/bugs.json'
var bugs = _readJsonFile(bugsFilePath)

async function query(filterBy) {
    try {
        let filteredBugs = [...bugs]
        
        // apply filtering
        filteredBugs = filteredBugs.filter(bug => !filterBy.title || new RegExp(filterBy.title, 'i').test(bug.title))
        filteredBugs = filteredBugs.filter(bug => !filterBy.severity || bug.severity >= filterBy.severity)
        filteredBugs = filteredBugs.filter(bug => !filterBy.tags.length || filterBy.tags.filter(tag => bug.tags.includes(tag)).length === filterBy.tags.length)

        // apply sorting
        switch(filterBy.sortBy) {
            case 'title':
                if(filterBy.sortDir > 0) filteredBugs = filteredBugs.sort((a,b) => a.title.localeCompare(b.title))
                else filteredBugs = filteredBugs.sort((a,b) => b.title.localeCompare(a.title))
                break
            case 'severity':
                if(filterBy.sortDir > 0) filteredBugs = filteredBugs.sort((a,b) => a.severity - b.severity)
                else filteredBugs = filteredBugs.sort((a,b) => b.severity - a.severity)
                break
            case 'createdAt':
                if(filterBy.sortDir > 0) filteredBugs = filteredBugs.sort((a,b) => a.createdAt - b.createdAt)
                else filteredBugs = filteredBugs.sort((a,b) => b.createdAt - a.createdAt)
                break
        }
        return filteredBugs
    } catch (err) {
        loggerService.error('Had problem getting bugs...')
        throw err
    }
}

async function getById(bugId) {
    try {
        return bugs.find(bug => bug._id === bugId)
    } catch (err) {
        loggerService.error(`Had problem getting bug ${bugId}...`)
        throw err
    }
}

async function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(idx, 1)

    try {
        _saveBugsToFile(bugsFilePath)
    } catch (err) {
        loggerService.error(`Had problem removing bug ${bugId}...`)
        throw err
    }
}

async function save(bugToSave) {
    try {
        if(bugToSave._id) {
            const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
            if(idx === -1) throw 'Bad Id'
            bugs.splice(idx, 1, bugToSave)
        } else {
            bugToSave._id = _makeId()
            bugToSave.createdAt = Date.now()
            bugs.push(bugToSave)
        }

        _saveBugsToFile(bugsFilePath)
        return bugToSave
    } catch (err) {
        loggerService.error(`Had problem saving bug ${bugId}...`)
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

function _readJsonFile(path) {
    const str = fs.readFileSync(path, 'utf8')
    const json = JSON.parse(str)
    return json
}

function _saveBugsToFile(path) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            return resolve()
        })
    })
}