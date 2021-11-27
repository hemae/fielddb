import rimraf from 'rimraf'
import {decryptTextFileAndParse, encryptObjectAndWriteTextFile} from '../tools/fileCryptor/FileCryptor'
import {areFieldsEquals, updateItem} from './handlers'
import generateId from '../tools/idGenerator/idGenerator'


export type ModelType = {
    _id: string
    _creationDate: number
    _updatingDate: number | null
    save: () => void
}

class Model {

    readonly _id: string = ''
    readonly _creationDate: number = 0
    readonly _updatingDate: number | null = null

    constructor() {
        this._id = generateId()
        this._creationDate = Date.now()
    }

    save(dataFilePath: string, boundFolderPath?: string): void {
        const {items} = decryptTextFileAndParse(dataFilePath)
        items.push(this)
        encryptObjectAndWriteTextFile(items, dataFilePath)
        if (boundFolderPath) {
            encryptObjectAndWriteTextFile([], boundFolderPath + `/${this._id}.dat`, 'collections')
        }
    }

    static findById(id: string, dataFilePath: string): any | null {
        const {items} = decryptTextFileAndParse(dataFilePath) as { items: any[] }
        return items.find(item => item._id === id) || null
    }

    static find(filter: any, dataFilePath: string): any[] {
        const {items} = decryptTextFileAndParse(dataFilePath) as { items: any[] }
        return !filter
            ? items
            : items.filter(item => areFieldsEquals<any>({item, filter}))
    }

    static findOne(filter: any, dataFilePath: string): any | null {
        const {items} = decryptTextFileAndParse(dataFilePath) as { items: any[] }
        return items.find(item => areFieldsEquals<any>({item, filter})) || null
    }

    static findByIdAndUpdate(id: string, update: any, dataFilePath: string): any | null {
        const {items} = decryptTextFileAndParse(dataFilePath) as { items: any[] }
        const item = items.find(item => item._id === id)
        if (!item) {
            return null
        }
        encryptObjectAndWriteTextFile(items.map(
            item => item._id === id
                ? updateItem<any>({item, update})
                : item
        ), dataFilePath)
        return updateItem<any>({item, update})
    }

    static findByIdAndDelete(id: string, dataFilePath: string, boundFolderPath?: string): void {
        const {items} = decryptTextFileAndParse(dataFilePath) as { items: any[] }
        encryptObjectAndWriteTextFile(items.filter(item => item._id !== id), dataFilePath)
        if (boundFolderPath) {
            rimraf.sync(boundFolderPath + `/${id}.dat`)
        }
    }

}

export default Model