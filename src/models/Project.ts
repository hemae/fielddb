import Model, {ModelType} from '../Model/Model'
import config from 'config'


export type ProjectType = {
    projectName: string
    ownerId: string
    shared: boolean
} & ModelType

class Project extends Model {

    projectName: string = ''     //required
    ownerId: string = ''    //required
    shared: boolean = false
    static dataFilePath: string = config.get('projectsDataPath')

    constructor(options: {projectName: string, ownerId: string}) {
        super()
        this.projectName = options.projectName
        this.ownerId = options.ownerId
    }

    save(): void {
        super.save(Project.dataFilePath, config.get('projectsPath'))
    }

    static findById(id: string): ProjectType | null {
        return super.findById(id, Project.dataFilePath)
    }

    static find(filter?: any): ProjectType[] {
        return super.find(filter, Project.dataFilePath)
    }

    static findOne(filter: any): ProjectType | null {
        return super.findOne(filter, Project.dataFilePath)
    }

    static findByIdAndUpdate(id: string, update: any): ProjectType | null {
        return super.findByIdAndUpdate(id, update, Project.dataFilePath)
    }

    static findByIdAndDelete(id: string): void {
        super.findByIdAndDelete(id, Project.dataFilePath, config.get('projectsPath'))
    }

}

export default Project