import express from 'express'
import { getBugs, getBugById, createBug, updateBug, deleteBug  } from './bug.controller.js'

const router = express.Router()

router.get('/', getBugs)
router.get('/:bugId', getBugById)
router.post('/', createBug)
router.put('/', updateBug)
router.delete('/:bugId', deleteBug)

export const bugRoutes = router