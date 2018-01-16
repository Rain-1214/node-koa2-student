import { UserDao } from '../dao/userDao';
import { Service, Inject } from '../entity/inject';
import { User } from '../entity/User';
import { Email } from '../entity/email';
import { Verification } from '../entity/verification';


@Service()
export class UserService {

    @Inject('UserDao')
    private userDao: UserDao;

    @Inject('Email')
    private email: Email;

    async login(username: string, password: string): Promise<string> {
        const user = await this.userDao.getUserByUsername(username);
        if (user.length === 0) {
            return '用户不存在';
        }
        if (user.length !== 0) {
            return user[0].password === password ? 'success' : '密码不正确';
        }
    }

    async sendVerificationCode(emailAddress: string): Promise<string> {
        const codeNum = Math.floor(Math.random() * 1000000);
        const code = `${codeNum}`.padStart(6, '0');
        const info = await this.email.send(emailAddress, '验证码', `<p>【NODEJS】 您的验证码为${code}</p>`);
        if (info) {
            return 'success';
        } else {
            return 'send email fail';
        }
    }


}

