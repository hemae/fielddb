import config from 'config'
import {decryptTextFileAndParse, encryptObjectAndWriteTextFile} from '../tools/fileCryptor/FileCryptor'
import {areFieldsEquals, updateItem} from '../Model/handlers'
import Project from './Project'


function setProjectUpdate(projectId: string) {
    const allProjectsDataPath: string = config.get('projectsDataPath')
    const projects = decryptTextFileAndParse<Project>(allProjectsDataPath)
    encryptObjectAndWriteTextFile(projects.map(project => project._id === projectId ? {...project, _updatingDate: Date.now()} : project), allProjectsDataPath)
}

type CollectionType = {
    collectionName: string,
    items: any[]
}

const collection = {

    getCollectionNames(projectId: string): Array<string> {
        const projectDataPath = config.get('projectsPath') + `/${projectId}.dat`
        let collections = decryptTextFileAndParse<CollectionType>(projectDataPath)
        return collections.map(collection => collection.collectionName)
    },

    deleteCollection(collectionName: string, projectId: string): void {
        const projectDataPath = config.get('projectsPath') + `/${projectId}.dat`
        let collections = decryptTextFileAndParse<CollectionType>(projectDataPath)
        encryptObjectAndWriteTextFile(collections.filter(collection => collection.collectionName !== collectionName), projectDataPath)
        setProjectUpdate(projectId)
    },

    save(collectionName: string, projectId: string, item: object): void {
        const projectDataPath = config.get('projectsPath') + `/${projectId}.dat`
        let collections = decryptTextFileAndParse<CollectionType>(projectDataPath)
        const collection: CollectionType | undefined = collections.find(collection => collection.collectionName === collectionName)
        if (!collection) {
            const newCollection: CollectionType = {
                collectionName,
                items: [item]
            }
            collections.push(newCollection)
        } else {
            collections = collections.map(
                collection => collection.collectionName === collectionName
                    ? {
                        ...collection,
                        items: [...collection.items, item]
                    }
                    : collection
            )
        }
        encryptObjectAndWriteTextFile(collections, projectDataPath)
        setProjectUpdate(projectId)
    },

    findById(collectionName: string, projectId: string, itemId: string): object | null {
        const projectDataPath = config.get('projectsPath') + `/${projectId}.dat`
        const collections = decryptTextFileAndParse<CollectionType>(projectDataPath)
        const collection: CollectionType | undefined = collections.find(collection => collection.collectionName === collectionName)
        if (!collection) {
            return null
        }
        return collection.items.find(item => item._id === itemId) || null
    },

    find(collectionName: string, projectId: string, filter?: object ): object[] {
        const projectDataPath = config.get('projectsPath') + `/${projectId}.dat`
        const collections = decryptTextFileAndParse<CollectionType>(projectDataPath)
        const collection: CollectionType | undefined = collections.find(collection => collection.collectionName === collectionName)
        if (!collection) {
            return []
        }
        return !filter
            ? collection.items
            : collection.items.filter(item => areFieldsEquals<object>({item, filter}))
    },

    findOne(collectionName: string, projectId: string, filter: object ): object | null {
        const projectDataPath = config.get('projectsPath') + `/${projectId}.dat`
        const collections = decryptTextFileAndParse<CollectionType>(projectDataPath)
        const collection: CollectionType | undefined = collections.find(collection => collection.collectionName === collectionName)
        if (!collection) {
            return null
        }
        return collection.items.find(item => areFieldsEquals<object>({item, filter})) || null
    },

    findByIdAndUpdate(collectionName: string, projectId: string, itemId: string, update: object): object | null {
        const projectDataPath = config.get('projectsPath') + `/${projectId}.dat`
        const collections = decryptTextFileAndParse<CollectionType>(projectDataPath)
        const collection: CollectionType | undefined = collections.find(collection => collection.collectionName === collectionName)
        if (!collection) {
            return null
        }
        const item: object | undefined = collection.items.find(item => item._id === itemId)
        if (!item) {
            return null
        }
        encryptObjectAndWriteTextFile(collections.map(
            collection => collection.collectionName === collectionName
                ? {
                    ...collection,
                    items: collection.items.map(
                        item => item._id === itemId
                            ? updateItem<object>({item, update})
                            : item
                    )
                }
                : collection
        ), projectDataPath)
        setProjectUpdate(projectId)
        return updateItem<object>({item, update})
    },

    findByIdAndDelete(collectionName: string, projectId: string, itemId: string): void {
        const projectDataPath = config.get('projectsPath') + `/${projectId}.dat`
        const collections = decryptTextFileAndParse<CollectionType>(projectDataPath)
        encryptObjectAndWriteTextFile(collections.map(
            collection => collection.collectionName === collectionName
                ? {
                    ...collection,
                    items: collection.items.filter(item => item._id !== itemId)
                }
                : collection
        ), projectDataPath)
        setProjectUpdate(projectId)
    }

}

export default collection