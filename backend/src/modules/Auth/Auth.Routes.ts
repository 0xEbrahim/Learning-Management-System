import express from 'express'
import { validate } from '../../utils/validation'
import { registerValidation } from './Auth-Validation'
import { register } from './Auth.Controller'
const router = express.Router()

router.post("/", validate(registerValidation), register)

export const authRouter = router