import {Router, Request, Response, IRouter} from 'express'
import log from '../tools/logger'
import User from '../models/User'
import {createToken} from '../tools/tokenCryptor/TokenCryptor'


const router: IRouter = Router()

router.post('/signup',
    async (req: Request, res: Response) => {
        try {

            const {login, password} = req.body as {login: string, password: string}

            if (!login) {
                return res.status(400).json({message: 'Login is required'})
            }

            if (password.length < 6) {
                return res.status(400).json({message: 'Minimum length of password is 6 characters'})
            }

            const candidate = User.findOne({login})
            if (candidate) {
                return res.status(400).json({message: 'Login is not available'})
            }

            const user = new User({login, password})
            user.save()

            res.status(201).json({message: 'User has been registered successfully'})

        } catch (e: any) {
            log.error(e.message)
            res.status(500).json({message: 'Something went wrong'})
        }
    })

router.post('/signin',
    async (req: Request, res: Response) => {
        try {

            const {login, password} = req.body as {login: string, password: string}

            const user = User.findOne({login})
            if (!user) {
                return res.status(400).json({message: 'Incorrect login data'})
            }

            if (password !== user.password) {
                return res.status(400).json({message: 'Incorrect login data'})
            }

            const token = createToken({
                userId: user._id,
                tokenDate: Date.now()
            })

            res.status(200).json({user: {id: user._id, login: user.login}, token, message: 'Success'})

        } catch (e: any) {
            log.error(e.message)
            res.status(500).json({message: 'Something went wrong'})
        }
    })

module.exports = router


