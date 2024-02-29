import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from'path'
import dotenv from 'dotenv'
import { loggerService } from './services/logger.service.js'

const app = express()

app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('public')))
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
        credentials: true
    }
    app.use(cors(corsOptions))
}

import { bugRoutes } from './api/bug/bug.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'
import { msgRoutes } from './api/msg/msg.routes.js'

app.use('/api/user', userRoutes)
app.use('/api/bug', bugRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/msg', msgRoutes)


app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

dotenv.config()
const port = process.env.PORT || 3030
app.listen(port, () => {
    loggerService.info(`Listening to server on port ${port}`)
})