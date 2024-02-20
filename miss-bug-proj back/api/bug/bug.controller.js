import { authService } from "../auth/auth.service.js"
import { bugService } from "./bug.service.js"

export async function getBugs(req, res) {
    try {
        const filterBy = {
            title: req.query.title || '',   
            severity: +req.query.severity || 0,
            tags: JSON.parse(req.query.tags) || [],
            sortBy: req.query.sortBy || 'createdAt', // title, severity, createdAt 
            sortDir: +req.query.sortDir || 1 // 1, -1
        }

        const bugs = await bugService.query(filterBy)
        res.send(bugs)
    } catch (err) {
        res.status(400).send(`Couldn't get bugs...`)
    }
}

export async function getBugById(req, res) {
    const { bugId } = req.params
    
    var latestBudId = req.cookies.latestBugId || []
    if(!latestBudId.includes(bugId)) {
        if(latestBudId.length >= 3) return res.status(401).send(`Wait a bit...`)
        latestBudId.push(bugId)
    }

    try {
        const bug = await bugService.getById(bugId)
        
        res.cookie('latestBugId', latestBudId, { maxAge: 1000 * 7})
        res.send(bug)
    } catch (err) {
        res.status(400).send(`Couldn't get bug...`)
    }
}

export async function createBug(req, res) {
    const { title, description, severity, tags } = req.body
    try {
        const bugToSave = { _id: undefined, title, description, severity: +severity, tags }
        const savedBug = await bugService.save(bugToSave, req.loggedInUser)
        res.send(savedBug)
    } catch (err) {
        res.status(400).send(`Couldn't save bug...`)
    }
}

export async function updateBug(req, res) {
    const { _id, title, description, severity, tags } = req.body
    try {
        const bugToSave = { _id, title, description, severity: +severity, tags }
        const savedBug = await bugService.save(bugToSave, req.loggedInUser)
        res.send(savedBug)
    } catch (err) {
        res.status(400).send(`Couldn't save bug...`)
    }
}

export async function deleteBug(req, res) {
    const { bugId } = req.params
    try {
        await bugService.remove(bugId, req.loggedInUser)
        res.send(`bug ${bugId} was removed`)
    } catch (err) {
        res.status(err.code).send(`Couldn't remove bug : ${err.msg}`)
    }
}