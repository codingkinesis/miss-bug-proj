import Axios from 'axios'
const axios = Axios.create({withCredentials: true})

const BASE_URL = '//localhost:3030/api/users/'

export const userService = {
    query,
    getById,
    save,
    remove,
    getDefaultUser,
}


async function query() {
    let { data: users } = await axios.get(BASE_URL)
    return users
}
async function getById(userId) {
    const url = BASE_URL + userId
    const { data: user } = await axios.get(url)
    return user
}
async function remove(userId) {
    const url = `${BASE_URL}${userId}`
    const { data: user } = await axios.delete(url)
    return user
}
async function save(user) {
    const method = user._id ? 'put' : 'post'
    const { data: savedUser } = await axios[method](BASE_URL, user)
    return savedUser
}

function getDefaultUser() { // Fix
    return {
        title: '',
        description: '',
        severity: 0,
        tags: [],
    }
}