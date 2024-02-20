import Axios from 'axios'
const axios = Axios.create({withCredentials: true})

const BASE_URL = (process.env.NODE_ENV !== 'development') ?
    '/api/bug/' :
    '//localhost:3030/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getDefaultBug,
}


async function query(filterBy) {
    const tagsStr = JSON.stringify(filterBy.tags)
    let { data: bugs } = await axios.get(BASE_URL, {params: {...filterBy, tags: tagsStr}})
    return bugs
}
async function getById(bugId) {
    const url = BASE_URL + bugId
    const { data: bug } = await axios.get(url)
    return bug
}
async function remove(bugId) {
    const url = `${BASE_URL}${bugId}`
    const { data: bug } = await axios.delete(url)
    return bug
}
async function save(bug) {
    const method = bug._id ? 'put' : 'post'
    const { data: savedBug } = await axios[method](BASE_URL, bug)
    return savedBug
}

function getDefaultFilter() { 
    return {
        title: '',
        severity: 0,
        tags: [],
        sortBy: 'createdAt',
        sortDir: 1
    }
}

function getDefaultBug() { 
    return {
        title: '',
        description: '',
        severity: 0,
        tags: [],
    }
}