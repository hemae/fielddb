import {Router, Request, Response, IRouter} from 'express'
import log from '../tools/logger'
import auth from '../middleware/auth'
import collection from '../models/collection'


const router: IRouter = Router()

router.put('/save',
    //@ts-ignore
    auth,
    async (req: Request & {projectId: string}, res: Response) => {
        try {

            const {
                collectionName,
                item
            } = req.body as { collectionName: string, item: any }

            const projectId: string = req.projectId

            if (!collectionName || !projectId || !item) {
                return res.status(400).json({message: 'Data is not enough'})
            }

            collection.save(collectionName, projectId, item)

            res.status(201).json({message: 'Item has been saved successfully'})

        } catch (e: any) {
            log.error(e.message)
            res.status(500).json({message: 'Something went wrong'})
        }
    }
)

router.post('/find',
    //@ts-ignore
    auth,
    async (req: Request & {projectId: string}, res: Response) => {
        try {

            const {
                collectionName,
                filter
            } = req.body as { collectionName: string, filter: any }

            const projectId: string = req.projectId

            if (!collectionName || !projectId) {
                return res.status(400).json({message: 'Data is not enough'})
            }

            const items: any[] = collection.find(collectionName, projectId, filter)

            res.json({items})

        } catch (e: any) {
            log.error(e.message)
            res.status(500).json({message: 'Something went wrong'})
        }
    }
)

router.post('/findOne',
    //@ts-ignore
    auth,
    async (req: Request & {projectId: string}, res: Response) => {
        try {

            const {
                collectionName,
                filter
            } = req.body as { collectionName: string, filter: any }

            const projectId: string = req.projectId

            if (!collectionName || !projectId) {
                return res.status(400).json({message: 'Data is not enough'})
            }

            const item: any = collection.findOne(collectionName, projectId, filter)

            res.json({item})

        } catch (e: any) {
            log.error(e.message)
            res.status(500).json({message: 'Something went wrong'})
        }
    }
)

router.post('/findById',
    //@ts-ignore
    auth,
    async (req: Request & {projectId: string}, res: Response) => {
        try {

            const {
                collectionName,
                itemId
            } = req.body as { collectionName: string, itemId: string }

            const projectId: string = req.projectId

            if (!collectionName || !projectId || !itemId) {
                return res.status(400).json({message: 'Data is not enough'})
            }

            const item: any = collection.findById(collectionName, projectId, itemId)

            res.json({item})

        } catch (e: any) {
            log.error(e.message)
            res.status(500).json({message: 'Something went wrong'})
        }
    }
)

router.post('/findByIdAndUpdate',
    //@ts-ignore
    auth,
    async (req: Request & {projectId: string}, res: Response) => {
        try {

            const {
                collectionName,
                itemId,
                update
            } = req.body as { collectionName: string, itemId: string, update: any }

            const projectId: string = req.projectId

            if (!collectionName || !projectId || !itemId || !update) {
                return res.status(400).json({message: 'Data is not enough'})
            }

            const item: object | null = collection.findByIdAndUpdate(collectionName, projectId, itemId, update)

            res.json({item})

        } catch (e: any) {
            log.error(e.message)
            res.status(500).json({message: 'Something went wrong'})
        }
    }
)

router.post('/findByIdAndDelete',
    //@ts-ignore
    auth,
    async (req: Request & {projectId: string}, res: Response) => {
        try {

            const {
                collectionName,
                itemId
            } = req.body as { collectionName: string, itemId: string }

            const projectId: string = req.projectId

            if (!collectionName || !projectId || !itemId) {
                return res.status(400).json({message: 'Data is not enough'})
            }

            collection.findByIdAndDelete(collectionName, projectId, itemId)

            res.json({message: 'Item has been deleted successfully'})

        } catch (e: any) {
            log.error(e.message)
            res.status(500).json({message: 'Something went wrong'})
        }
    }
)


module.exports = router