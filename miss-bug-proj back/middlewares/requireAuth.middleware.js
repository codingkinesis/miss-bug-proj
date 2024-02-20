import { authService } from "../api/auth/auth.service.js"
import { loggerService } from "../services/logger.service.js"

export function requireUser(req, res, next) {
    const loggedInUser = authService.validateToken(req.cookies.loginToken)
    if(!loggedInUser) return res.status(401).send('Not authenticated')
    
    req.loggedInUser = loggedInUser
    next()
}

export function requireAdmin(req, res, next) {
    const loggedInUser = authService.validateToken(req.cookies.loginToken)
    if(!loggedInUser) return res.status(401).send('Not authenticated')
    if(!loggedInUser.isAdmin) {
        loggerService.warn(`${loggedInUser.username} tried to perform an admin action`)
        return res.status(403).send('Not autherized')
    }
    
    req.loggedInUser = loggedInUser
    next()
}