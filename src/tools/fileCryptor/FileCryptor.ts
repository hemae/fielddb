import {readFileSync, writeFileSync} from 'fs'
import crypt from 'hans-cryptor'
import config from 'config'


export function decryptTextFileAndParse(filePath: string) {
    return JSON.parse(
        crypt.decrypt(
            readFileSync(filePath, 'utf8'), config.get('fileSecret')
        ))
}

export function encryptObjectAndWriteTextFile(obj: Object, filePath: string, objectName?: string): void {
    writeFileSync(filePath, crypt.encrypt(JSON.stringify({[`${objectName || 'items'}`]: obj}), config.get('fileSecret')), 'utf8')
}