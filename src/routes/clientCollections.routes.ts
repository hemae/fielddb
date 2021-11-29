import {Router, Request, Response, IRouter} from 'express'
import auth from '../middleware/auth'
import collection from '../models/collection'
import log from '../tools/logger'
import generateId from '../tools/idGenerator/src'
import authPart from '../middleware/authPart'
import Project from '../models/Project'


const router: IRouter = Router()

router.get('/:projectId/:collectionName/:page?',
    //@ts-ignore
    authPart,
    async (req: Request & {userId: string | null}, res: Response) => {
        try {

            const items = collection.find( req.params.collectionName, req.params.projectId)

            const page = +req.params.page || null // (0 => null)
            const pages = Math.ceil(items.length / 10)
            if (!!pages && page && (page <= 0 || page > pages)) {
                return res.status(404).json({message: 'Not found'})
            }

            const responseObject = {
                count: items.length,
                pages,
                page,
                items: page ? items.slice(10 * (page - 1), 10 * page) : items
            }

            res.json(responseObject)

        } catch (e: any) {
            log.error(e.message)
            res.status(500).json({message: 'Something went wrong'})
        }
    }
)

router.get('/:projectId',
    //@ts-ignore
    authPart,
    async (req: Request, res: Response) => {
        try {

            const collectionNames = collection.getCollectionNames(req.params.projectId)
            res.json({collectionNames})

        } catch (e: any) {
            log.error(e.message)
            res.status(500).json({message: 'Something went wrong'})
        }
    }
)

router.put('/create',
    //@ts-ignore
    auth,
    async (req: Request, res: Response) => {
        try {

            let {
                projectId,
                collectionName,
                item
            } = req.body as { projectId: string, collectionName: string, item: any }

            if (!collectionName || !projectId || !item) {
                return res.status(400).json({message: 'Data is not enough'})
            }

            item = {...item, _id: generateId(), _creationDate: Date.now(), _updatingDate: null}

            collection.save(collectionName, projectId, item)

            const items = collection.find(collectionName, projectId)

            const page = 1
            const pages = Math.ceil(items.length / 10)

            const responseObject = {
                count: items.length,
                pages,
                page,
                items: items.slice(10 * (page - 1), 10 * page)
            }

            res.json(responseObject)

            res.status(201).json({items})

        } catch (e: any) {
            log.error(e.message)
            res.status(500).json({message: 'Something went wrong'})
        }
    }
)

router.post('/update/:page',
    //@ts-ignore
    auth,
    async (req: Request & {userId: string}, res: Response) => {
        try {

            const {
                projectId,
                collectionName,
                itemId,
                update
            } = req.body as { projectId: string, collectionName: string, itemId: string, update: any }

            if (!collectionName || !projectId || !itemId || !update) {
                return res.status(400).json({message: 'Data is not enough'})
            }

            const project = Project.findById(req.params.projectId)
            if (!project) {
                return res.status(404).json({message: 'Project not found'})
            }

            if (project.ownerId !== req.userId) {
                return res.status(403).json({message: 'No access for deleting'})
            }

            collection.findByIdAndUpdate(collectionName, projectId, itemId, update)

            const items = collection.find(collectionName, projectId)

            const page = +req.params.page
            const pages = Math.ceil(items.length / 10)
            if (page && (page <= 0 || page > pages)) {
                return res.status(404).json({message: 'Not found'})
            }

            const responseObject = {
                count: items.length,
                pages,
                page,
                items: page ? items.slice(10 * (page - 1), 10 * page) : items
            }

            res.json(responseObject)

        } catch (e: any) {
            log.error(e.message)
            res.status(500).json({message: 'Something went wrong'})
        }
    }
)

router.post('/delete/:page',
    //@ts-ignore
    auth,
    async (req: Request & {userId: string}, res: Response) => {
        try {

            const {
                projectId,
                collectionName,
                itemId
            } = req.body as { projectId: string, collectionName: string, itemId: string }

            if (!collectionName || !projectId || !itemId) {
                return res.status(400).json({message: 'Data is not enough'})
            }

            const project = Project.findById(projectId)
            if (!project) {
                return res.status(404).json({message: 'Project not found'})
            }

            if (project.ownerId !== req.userId) {
                return res.status(403).json({message: 'No access for deleting'})
            }

            collection.findByIdAndDelete(collectionName, projectId, itemId)

            const items = collection.find(collectionName, projectId)

            const page = +req.params.page
            const pages = Math.ceil(items.length / 10)

            const responseObject = {
                count: items.length,
                pages,
                page,
                items: items.slice(10 * (page - 1), 10 * page)
            }

            res.json(responseObject)

        } catch (e: any) {
            log.error(e.message)
            res.status(500).json({message: 'Something went wrong'})
        }
    }
)

router.post('/deleteCollection',
    //@ts-ignore
    auth,
    async (req: Request & {userId: string}, res: Response) => {
        try {

            const {
                projectId,
                collectionName
            } = req.body as { projectId: string, collectionName: string }

            if (!collectionName || !projectId) {
                return res.status(400).json({message: 'Data is not enough'})
            }

            const project = Project.findById(projectId)
            if (!project) {
                return res.status(404).json({message: 'Project not found'})
            }

            if (project.ownerId !== req.userId) {
                return res.status(403).json({message: 'No access for deleting'})
            }

            collection.deleteCollection(collectionName, projectId)

            const collectionNames = collection.getCollectionNames(projectId)
            res.json({collectionNames})

        } catch (e: any) {
            log.error(e.message)
            res.status(500).json({message: 'Something went wrong'})
        }
    }
)

module.exports = router