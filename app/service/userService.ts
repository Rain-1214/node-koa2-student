import { UserDao } from '../dao/userDao';
import { Service, Inject } from '../entity/inject';


@Service()
export class UserService {

    @Inject('UserDao')
    private userDao: UserDao;

    findUserById(id: number) {
        this.userDao.getUserById(id);
    }


}

