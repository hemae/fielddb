import {Router, Request, Response, IRouter} from 'express'
import log from '../tools/logger'
import auth from '../middleware/auth'
import Project from '../models/Project'
import authPart from '../middleware/authPart'


const router: IRouter = Router()

router.get('/',
    //@ts-ignore
    auth,
    async (req: Request & {userId: string}, res: Response) => {
        try {

            const projects = Project.find({ownerId: req.userId})
            res.json({projects})

        } catch (e: any) {
            log.error(e.message)
            res.status(500).json({message: 'Something went wrong'})
        }
    }
)

router.get('/:projectId',
    //@ts-ignore
    authPart,
    async (req: Request & {userId: string | null}, res: Response) => {
        try {

            const project = Project.findById(req.params.projectId)
            res.json({project})

        } catch (e: any) {
            log.error(e.message)
            res.status(500).json({message: 'Something went wrong'})
        }
    }
)

router.put('/create',
    //@ts-ignore
    auth,
    async (req: Request & {userId: string}, res: Response) => {
        try {

            const {projectName} = req.body as { projectName: 'string' }

            const project = new Project({projectName, ownerId: req.userId})
            project.save()

            const projects = Project.find({ownerId: req.userId})

            res.status(201).json({projects})

        } catch (e: any) {
            log.error(e.message)
            res.status(500).json({message: 'Something went wrong'})
        }
    }
)

router.put('/share/:projectId',
    //@ts-ignore
    auth,
    async (req: Request & {userId: string}, res: Response) => {
        try {

            const projectId = req.params.projectId

            let project = Project.findById(projectId)
            if (!project) {
                return res.status(404).json({message: 'Project not found'})
            }

            project = Project.findByIdAndUpdate(projectId, {
                shared: !project.shared
            })

            res.json({project})

        } catch (e: any) {
            log.error(e.message)
            res.status(500).json({message: 'Something went wrong'})
        }
    }
)

router.post('/rename',
    //@ts-ignore
    auth,
    async (req: Request & {userId: string}, res: Response) => {
        try {

            const {projectName, projectId} = req.body as { projectName: string, projectId: string }

            Project.findByIdAndUpdate(projectId, {projectName})

            const projects = Project.find({ownerId: req.userId})

            res.status(201).json({
                message: 'Project folder has been renamed successfully',
                projects
            })

        } catch (e: any) {
            log.error(e.message)
            res.status(500).json({message: 'Something went wrong'})
        }
    }
)

router.post('/delete',
    //@ts-ignore
    auth,
    async (req: Request & {userId: string}, res: Response) => {
        try {

            const {projectId} = req.body as { projectId: string }

            Project.findByIdAndDelete(projectId)

            const projects = Project.find({ownerId: req.userId})

            res.status(201).json({
                message: 'Project folder has been removed successfully',
                projects
            })

        } catch (e: any) {
            log.error(e.message)
            res.status(500).json({message: 'Something went wrong'})
        }
    }
)

module.exports = router