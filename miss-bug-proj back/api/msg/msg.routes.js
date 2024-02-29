import express from 'express'
import { getMsgs, getMsgById, createMsg, deleteMsg  } from './msg.controller.js'
import { requireAdmin, requireUser } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/', getMsgs)
router.get('/:msgId', getMsgById)
router.post('/', requireUser, createMsg)
router.delete('/:msgId', requireAdmin, deleteMsg)

export const msgRoutes = router