import { msgService } from "./msg.service.js"

export async function getMsgs(req, res) {
    try {
        const msgs = await msgService.query()
        res.send(msgs)
    } catch (err) {
        res.status(400).send(`Couldn't get msgs...`)
    }
}

export async function getMsgById(req, res) {
    const { msgId } = req.params
    try {
        const msg = await msgService.getById(msgId)
        res.send(msg)
    } catch (err) {
        res.status(400).send(`Couldn't get msg...`)
    }
}

export async function createMsg(req, res) {
    const { txt, aboutBugId, } = req.body
    try {
        const msgToSave = { _id: undefined, txt, aboutBugId }
        const savedMsg = await msgService.save(msgToSave, req.loggedInUser)
        res.send(savedMsg)
    } catch (err) {
        res.status(400).send(`Couldn't save msg...`)
    }
}

export async function deleteMsg(req, res) {
    const { msgId } = req.params
    try {
        await msgService.remove(msgId, req.loggedInUser)
        res.send(`msg ${msgId} was removed`)
    } catch (err) {
        res.status(err.code).send(`Couldn't remove msg : ${err.msg}`)
    }
}