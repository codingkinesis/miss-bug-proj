import { storageService } from './async-storage.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const STORAGE_KEY_USER_DB = 'userDB'

export const userService = {
    getUsers,
    getById,
    remove,
    create,
    update,
    signup,
    login,
    logout,
    saveLocalUser,
    getLoggedinUser,
    getEmptyUser,
}

window.userService = userService

function getUsers() {
    return storageService.query(STORAGE_KEY_USER_DB)
}

function getById(userId) {
    return storageService.get(STORAGE_KEY_USER_DB, userId)
}

function remove(userId) {
    return storageService.remove(STORAGE_KEY_USER_DB, userId)
}

function create(user) {
    user.isAdmin = false
    user.score = 1000
    user.createdAt = Date.now()
    return storageService.post(STORAGE_KEY_USER_DB, user)
}

async function update(fieldsToUpdate) {
    const user = await getById(fieldsToUpdate._id)

    const updatedUser = await storageService.put(STORAGE_KEY_USER_DB, {...user, ...fieldsToUpdate })
    if (getLoggedinUser()._id === updatedUser._id) saveLocalUser(updatedUser)
    return updatedUser
}

async function signup(userCred) {
    const user = create(userCred)
    return saveLocalUser(user)
}

async function login(userCred) {
    const users = await storageService.query(STORAGE_KEY_USER_DB)
    const user = users.find(user => user.username === userCred.username)
    if (user) {
        return saveLocalUser(user)
    }
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function saveLocalUser(user) {
    user = { _id: user._id, fullname: user.fullname, score: user.score, isAdmin: user.isAdmin }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function getEmptyUser() {
    return {
        fullname: '',
        username: '',
        password: '',
    }
}
