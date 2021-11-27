import {Express} from 'express'
const express = require('express')
const config = require('config')
import log from './tools/logger'
import * as path from 'path'

const app: Express = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/collections', require('./routes/collections.routes'))
app.use('/api/client/collections', require('./routes/clientCollections.routes'))
app.use('/api/projects', require('./routes/projects.routes'))
app.use('/api/connect', require('./routes/connect.routes'))
app.use('/api/auth', require('./routes/auth.routes'))

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, '..', 'client', 'build')))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'))
    })
}

const PORT: number = config.get('port') || 5000

function start() {
    try {
        app.listen(PORT, () => log.info(`Server has been started on port ${PORT}`))
    } catch (e: any) {
        log.error(`Server Error: ${e.message}`)
        process.exit(1)
    }
}


start()