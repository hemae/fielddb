import fileCrypt from 'hans-files-cryptor'
import config from 'config'


export function decryptTextFileAndParse<ItemType>(filePath: string): ItemType[] {
    try {
        const object = fileCrypt.decryptTextFileAndParse<{items: ItemType[]}>(filePath, config.get('fileSecret'))
        return object.items
    } catch {

        fileCrypt.encryptObjectAndWriteTextFile({items: []}, filePath, config.get('fileSecret'))
        return []
    }
}

export function encryptObjectAndWriteTextFile(items: any[], filePath: string): void {
    fileCrypt.encryptObjectAndWriteTextFile({items}, filePath, config.get('fileSecret'))
}