import Model, {ModelType} from '../Model/Model'
import config from 'config'


export type UserType = {
    login: string,
    password: string
} & ModelType

class User extends Model {

    login: string = ''     //required
    password: string = ''     //required
    static dataFilePath: string = config.get('usersDataPath')

    constructor(options: {login: string, password: string}) {
        super()
        this.login = options.login
        this.password = options.password
    }

    save(): void {
        super.save(User.dataFilePath)
    }

    static findById(id: string): UserType | null {
        return super.findById(id, User.dataFilePath)
    }

    static find(filter?: any): UserType[] {
        return super.find(filter, User.dataFilePath)
    }

    static findOne(filter: any): UserType | null {
        return super.findOne(filter, User.dataFilePath)
    }

    static findByIdAndUpdate(id: string, update: any): UserType | null {
        return super.findByIdAndUpdate(id, update, User.dataFilePath)
    }

    static findByIdAndDelete(id: string): void {
        super.findByIdAndDelete(id, User.dataFilePath)
    }

}


export default User