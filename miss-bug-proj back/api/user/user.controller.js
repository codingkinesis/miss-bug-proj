import { userService } from "./user.service.js"

export async function getUsers(req, res) {
    try {
        const users = await userService.query()
        res.send(users)
    } catch (err) {
        res.status(400).send(`Couldn't get users...`)
    }
}

export async function getUserById(req, res) {
    const { userId } = req.params
    try {
        const user = await userService.getById(userId)

        res.send(user)
    } catch (err) {
        res.status(400).send(`Couldn't get user...`)
    }
}

export async function createUser(req, res) {
    const { fullname, username, password, score } = req.body
    try {
        const userToSave = await userService.save({ _id: undefined, fullname, username, password, score: +score })
        res.send(userToSave)
    } catch (err) {
        res.status(400).send(`Couldn't update user...`)
    }
}

export async function updateUser(req, res) {
    const { _id, fullname, username, password, score } = req.body
    try {
        const userToSave = await userService.save({ _id, fullname, username, password, score: +score })
        res.send(userToSave)
    } catch (err) {
        res.status(400).send(`Couldn't update user...`)
    }
}

export async function deleteUser(req, res) {
    const { userId } = req.params
    try {
        await userService.remove(userId)
        res.send(`user ${userId} was removed`)
    } catch (err) {
        res.status(400).send(`Couldn't remove user...`)
    }
}