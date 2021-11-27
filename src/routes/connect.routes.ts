import {Router, Request, Response, IRouter} from 'express'
import log from '../tools/logger'
import auth from '../middleware/auth'


const router: IRouter = Router()

router.get('/',
    //@ts-ignore
    auth,
    async (req: Request & {userLogin: string, userId: string}, res: Response) => {
        try {

            log.info(`User ${req.userLogin} (id: ${req.userId}) is connected from back-server`)
            res.json({message: 'Connection has been set'})

        } catch (e: any) {
            log.error(e.message)
            res.status(500).json({message: 'Something went wrong'})
        }
    }
)

module.exports = router