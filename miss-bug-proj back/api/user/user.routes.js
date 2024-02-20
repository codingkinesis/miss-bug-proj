import express from 'express'
import { getUsers, getUserById, createUser, updateUser, deleteUser  } from './user.controller.js'
import { requireAdmin } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/', requireAdmin, getUsers)
router.get('/:userId', requireAdmin, getUserById)
router.post('/', requireAdmin, createUser)
router.put('/:userId', requireAdmin, updateUser)
router.delete('/:userId', requireAdmin, deleteUser)

export const userRoutes = router