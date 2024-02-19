import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'

import { loggerService } from '../../services/logger.service.js'
import { userService } from '../user/user.service.js'

const cryptr = new Cryptr(process.env.SECRET1 || 'my-super-duper-secret-crypt-code')

export const authService = {
    signup,
    login,
    getLoginToken,
    validateToken,
}

async function signup({fullname, username, password}) {

    loggerService.debug(`auth.service - signup with username ${username}, fullname ${fullname}`)
    if(!fullname || !username || !password) throw 'Missing required signup information'

    const userExist = await userService.getByUsername(username)
    if(userExist) throw 'Username already taken'

    const saltRounds = 13
    const hash = await bcrypt.hash(password, saltRounds)
    return userService.save({ fullname, username, password: hash })
}

async function login(username, password) {
    const user = await userService.getByUsername(username)
    if(!user) throw 'Unknown username'

    // Use // to make login easy while programming
    // const match = await bcrypt.compare(password, user.password)
    // if(!match) throw 'Invalid username or password'

    const miniUser = {
        _id: user._id,
        fullname: user.fullname,
        score: user.score,
        isAdmin: user.isAdmin,
    }
    return miniUser
}

function getLoginToken(user) {
    const str = JSON.stringify(user)
    const encryptedStr = cryptr.encrypt(str)
    return encryptedStr
}

function validateToken(token) {
    try {
        const json = cryptr.decrypt(token)
        const loggedInUser = JSON.parse(json)
        return loggedInUser
    } catch (err) {
        console.log('Invalid login token')
        return null
    }
}