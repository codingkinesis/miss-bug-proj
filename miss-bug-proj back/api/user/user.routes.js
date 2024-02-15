import express from 'express'
import { getUsers, getUserById, createUser, updateUser, deleteUser  } from './user.controller.js'

const router = express.Router()

router.get('/', getUsers)
router.get('/:userId', getUserById)
router.post('/', createUser)
router.put('/:userId', updateUser)
router.delete('/:userId', deleteUser)

export const userRoutes = router