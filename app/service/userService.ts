import { UserDao } from '../dao/userDao';
import { Service, Inject } from '../entity/inject';
import { User } from '../entity/User';


@Service()
export class UserService {

    @Inject('UserDao')
    private userDao: UserDao;

    findUserById(id: number): Promise<User[]> {
        return this.userDao.getUserById(id);
    }

    async updateUser(id: number, changeProperty: User): Promise<number> {
        const res = await this.userDao.updateUser(id, changeProperty);
        return res.changedRows;
    }

    async creatUser(user: User): Promise<number> {
        const res = await this.userDao.creatUser(user);
        return res.affectedRows;
    }

}

