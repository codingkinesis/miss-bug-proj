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
    const loggedInUser = authService.validateToken(req.cookies.loginToken)
    try {
        const creator = { _id: loggedInUser._id, fullname: loggedInUser.fullname }

        const bugToSave = await bugService.save({ _id: undefined, title, description, severity: +severity, tags, creator })
        res.send(bugToSave)
    } catch (err) {
        res.status(400).send(`Couldn't save bug...`)
    }
}

export async function updateBug(req, res) {
    const { _id, title, description, severity , createdAt, tags, creator } = req.body
    try {
        // const loggedInUser = authService.validateToken(req.cookies.loginToken)
        // if(loggedInUser._id !== creator._id) res.status(403).send(`Not your bug...`)

        const bugToSave = await bugService.save({ _id, title, description, severity: +severity, createdAt: +createdAt, tags, creator })
        res.send(bugToSave)
    } catch (err) {
        res.status(400).send(`Couldn't save bug...`)
    }
}

export async function deleteBug(req, res) {
    const { bugId } = req.params
    // const loggedInUser = authService.validateToken(req.cookies.loginToken)
    // if(!loggedInUser) return res.status(401).send('Not authenticated')

    try {
        await bugService.remove(bugId)
        res.send(`bug ${bugId} was removed`)
    } catch (err) {
        res.status(400).send(`Couldn't remove bug...`)
    }
}