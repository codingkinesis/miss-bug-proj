import Axios from 'axios'
const axios = Axios.create({withCredentials: true})

const BASE_URL = (process.env.NODE_ENV !== 'development') ?
    '/api/' :
    '//localhost:3030/api/'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const BACE_USER_URL = BASE_URL + 'user/'
const BACE_AUTH_URL = BASE_URL + 'auth/'

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


async function getUsers() {
    let { data: users } = await axios.get(BACE_USER_URL)
    return users
}
async function getById(userId) {
    const url = BACE_USER_URL + userId
    const { data: user } = await axios.get(url)
    return user
}
async function remove(userId) {
    const url = `${BACE_USER_URL}${userId}`
    const { data: user } = await axios.delete(url)
    return user
}
async function create(user) {
    const { data: savedUser } = await axios.post(BACE_USER_URL, user)
    return savedUser
}
async function update(fieldsToUpdate) {
    const user = await getById(fieldsToUpdate._id)

    const updatedUser = await storageService.put(BACE_USER_URL, {...user, ...fieldsToUpdate })
    if (getLoggedinUser()._id === updatedUser._id) saveLocalUser(updatedUser)
    return updatedUser
}
async function signup(userCred) {
    const url = `${BACE_AUTH_URL}signup`
    const { data: user } = await axios.post(url, userCred)
    return saveLocalUser(user)
}
async function login(userCred) {
    const url = `${BACE_AUTH_URL}login`
    const { data: user } = await axios.post(url, userCred)
    if (user) {
        return saveLocalUser(user)
    }
}
async function logout() {
    const url = `${BACE_AUTH_URL}logout`
    await axios.post(url)
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