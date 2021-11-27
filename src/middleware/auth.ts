import {Request, Response, NextFunction} from 'express'
import {decryptAndParseToken} from '../tools/tokenCryptor/TokenCryptor'
import User from '../models/User'
import tryParseToken from './helpers/tokenParser'
import log from '../tools/logger'
import Project from '../models/Project'


export default (req: Request & { userId: string, projectId?: string, userLogin: string }, res: Response, next: NextFunction) => {

    if (req.method === 'OPTIONS') {
        return next()
    }

    try {

        let token = null
        if (req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1]
        }

        if (!token) {
            return res.status(401).json({message: 'Authorization error'})
        }

        const tokenData: {login: string, password: string, projectId: string} | null = tryParseToken(token)

        if (tokenData) {
            const user = User.findOne({login: tokenData.login})
            if (!user) {
                return res.status(401).json({message: 'Authorization error'})
            }

            if (tokenData.password !== user.password) {
                log.error(`${user.login} (${user._id}) tried to sign in from back-server with invalid password`)
                return res.status(401).json({message: 'Authorization error'})
            }

            const project = Project.findById(tokenData.projectId)
            if (!project || project.ownerId !== user._id) {
                return res.status(401).json({message: 'Authorization error'})
            }

            req.userId = user._id
            req.userLogin = user.login
            req.projectId = tokenData.projectId
            return next()
        }

        const decryptedToken: {userId: string, tokenDate: number} = decryptAndParseToken(token)

        const user = User.findById(decryptedToken.userId)
        if (!user) {
            return res.status(401).json({message: 'Authorization error'})
        }

        if ((Date.now() - decryptedToken.tokenDate) / (1000 * 3600) > 6) {
            return res.status(401).json({message: 'Authorization error'})
        }

        req.userId = decryptedToken.userId
        next()

    } catch (e) {
        res.status(401).json({message: 'Authorization error'})
    }

}
