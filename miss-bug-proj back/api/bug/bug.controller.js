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
    try {
        var latestBudId = req.cookies.latestBugId || []
        if(!latestBudId.includes(bugId)) {
            if(latestBudId.length >= 3) return res.status(400).send(`Wait a bit...`)
            latestBudId.push(bugId)
        }
        
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
        const bugToSave = await bugService.save({ _id: undefined, title, description, severity: +severity, tags })
        res.send(bugToSave)
    } catch (err) {
        res.status(400).send(`Couldn't save bug...`)
    }
}

export async function updateBug(req, res) {
    const { _id, title, description, severity , createdAt, tags } = req.body
    try {
        const bugToSave = await bugService.save({ _id, title, description, severity: +severity, createdAt: +createdAt, tags})
        res.send(bugToSave)
    } catch (err) {
        res.status(400).send(`Couldn't save bug...`)
    }
}

export async function deleteBug(req, res) {
    const { bugId } = req.params
    try {
        await bugService.remove(bugId)
        res.send(`bug ${bugId} was removed`)
    } catch (err) {
        res.status(400).send(`Couldn't remove bug...`)
    }
}