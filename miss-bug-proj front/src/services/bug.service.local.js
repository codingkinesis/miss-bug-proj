import { storageService } from './async-storage.service.js'

const STORAGE_KEY = 'bugDB'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getDefaultBug,
}


async function query(filterBy) { 
    try {
        let filteredBugs = await storageService.query(STORAGE_KEY)
        
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
        console.error(err)
    }
}
function getById(bugId) {
    return storageService.get(STORAGE_KEY, bugId)
}
function remove(bugId) {
    return storageService.remove(STORAGE_KEY, bugId)
}
function save(bug) {
    if (bug._id) {
        return storageService.put(STORAGE_KEY, bug)
    } else {
        bug.createdAt = Date.now()
        bug.creator = {_id: "u101", fullname: "Alen Anderson"}
        return storageService.post(STORAGE_KEY, bug)
    }
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