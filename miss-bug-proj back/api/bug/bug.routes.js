import express from 'express'
import { getBugs, getBugById, createBug, updateBug, deleteBug  } from './bug.controller.js'
import { requireUser } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/', getBugs)
router.get('/:bugId', getBugById)
router.post('/', requireUser, createBug)
router.put('/', requireUser, updateBug)
router.delete('/:bugId', requireUser, deleteBug)

export const bugRoutes = router