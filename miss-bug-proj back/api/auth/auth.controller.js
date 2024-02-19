import { loggerService } from "../../services/logger.service.js"
import { authService } from "./auth.service.js"

export async function signup(req, res) {
    try {
        const credentials = req.body
        const account = await authService.signup(credentials)
        loggerService.debug(`auth.route - new account created ${JSON.stringify(account)}`)

        const user = await authService.login(credentials.username, credentials.password)
        loggerService.info(`User signup: ${JSON.stringify(user)}`)

        const loginToken = authService.getLoginToken(user)

        res.cookie('loginToken', loginToken, {sameSite: 'None', secure: true})
        res.json(user)
    } catch (err) {
        loggerService.error(`Failed to signup ${err}`)
        res.status(400).send({ err: `Failed to signup: ${err}`})
    }
}

export async function login(req, res) {
    const { username, password} = req.body
    try {
        const user = await authService.login(username, password)
        loggerService.info(`User login: ${JSON.stringify(user)}`)

        const loginToken = authService.getLoginToken(user)
        
        res.cookie('loginToken', loginToken, {sameSite: 'None', secure: true})
        res.json(user)
    } catch (err) {
        loggerService.error(`Failed to login ${err}`)
        res.status(400).send({ err: `Failed to login: ${err}`})
    }
}

export async function logout(req, res) {
    try {
        res.clearCookie('loginToken')
        res.send({msg: 'Logged out successfully'})
    } catch (err) {
        res.status(400).send({ err: 'Failed to logout' })
    }
}