import crypt from '../../modules/crypt/ctypt'
import config from 'config'


export const createToken = (data: any): string => {
    return crypt.encrypt(JSON.stringify(data), config.get('jwtSecret'))
}

export const decryptAndParseToken = (token: string): any => {
    return JSON.parse(crypt.decrypt(token, config.get('jwtSecret')))
}