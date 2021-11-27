import {Request, Response, NextFunction} from 'express'
import {decryptAndParseToken} from '../tools/tokenCryptor/TokenCryptor'
import Project from '../models/Project'


export default (req: Request & { userId: string | null }, res: Response, next: NextFunction) => {

    if (req.method === 'OPTIONS') {
        return next()
    }

    try {

        let token = null
        if (req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1]
        }

        if (!token) {
            req.userId = null
        } else {
            const decryptedToken: {userId: string, tokenDate: number} = decryptAndParseToken(token)
            req.userId = decryptedToken.userId
        }

        const project = Project.findById(req.params.projectId)
        if (!project) {
            return res.status(404).json({message: 'Project not found'})
        }

        if (!project.shared && req.userId !== project.ownerId) {
            return res.status(403).json({message: 'No access'})
        }

        next()

    } catch (e) {
        res.status(401).json({message: 'Authorization error'})
    }

}
