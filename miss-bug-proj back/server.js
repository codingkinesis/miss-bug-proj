import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from'path'
import { loggerService } from './services/logger.service.js'

const app = express()
const port = 3030

const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    credentials: true
}

app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

import { bugRoutes } from './api/bug/bug.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'

app.use('/api/users', userRoutes)
app.use('/api/bugs', bugRoutes)
app.use('/api/auth', authRoutes)

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

app.listen(port, () => {
    loggerService.info(`Listening to server on port ${port}`)
})