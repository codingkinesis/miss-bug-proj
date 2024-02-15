import fs from 'fs'
import { loggerService } from '../../services/logger.service.js'

export const userService = {
    query,
    getById,
    remove,
    save
}

const usersFilePath = './data/users.json'
var users = _readJsonFile(usersFilePath)

async function query() {
    try {
        let filteredUser = [...users]
        return filteredUser
    } catch (err) {
        loggerService.error('Had problem getting user...')
        throw err
    }
}

async function getById(userId) {
    try {
        return users.find(user => user._id === userId)
    } catch (err) {
        loggerService.error(`Had problem getting user ${userId}...`)
        throw err
    }
}

async function remove(userId) {
    const idx = users.findIndex(user => user._id === userId)
    users.splice(idx, 1)

    try {
        _saveUsersToFile(usersFilePath)
    } catch (err) {
        loggerService.error(`Had problem removing user ${userId}...`)
        throw err
    }
}

async function save(userToSave) {
    try {
        if(userToSave._id) {
            const idx = users.findIndex(user => user._id === userToSave._id)
            if(idx === -1) throw 'Bad Id'
            users.splice(idx, 1, userToSave)
        } else {
            userToSave._id = _makeId()
            users.push(userToSave)
        }

        _saveUsersToFile(usersFilePath)
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

function _readJsonFile(path) {
    const str = fs.readFileSync(path, 'utf8')
    const json = JSON.parse(str)
    return json
}

function _saveUsersToFile(path) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(users, null, 2)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            return resolve()
        })
    })
}