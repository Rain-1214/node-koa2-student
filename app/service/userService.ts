import { UserDao } from '../dao/userDao';
import { Service, Inject } from '../entity/inject';
import { User, UserState } from '../entity/User';
import { Email } from '../entity/email';
import { Verification } from '../entity/verification';
import { Encryption } from '../entity/encryption';
import { CodeDao } from '../dao/codeDao';
import { Code, CodeState } from '../entity/Code';


@Service()
export class UserService {

    @Inject('UserDao')
    private userDao: UserDao;

    @Inject('UserState')
    private userState: UserState;

    @Inject('Email')
    private email: Email;

    @Inject('Encryption')
    private encryption: Encryption;

    @Inject('CodeDao')
    private codeDao: CodeDao;

    @Inject('CodeState')
    private codeState: CodeState;

    async login(username: string, password: string): Promise<string | User> {
        const user = await this.userDao.getUserByUsername(username);
        if (user.length === 0) {
            return '用户不存在';
        }
        if (user.length !== 0) {
            const decryptPass = this.encryption.decrypt(user[0].password);
            return decryptPass === password ? user[0].userState === this.userState.USER_CAN_USE ? user[0] : '您的帐号已经被停封' : '密码不正确';
        }
    }

    async getCode(emailAddress: string): Promise<Code> {
        const code = await this.codeDao.getCodeByEmailAndState(emailAddress, this.codeState.CODE_CAN_USE);
        return code.length === 0 ? null : code[0];
    }

    async checkCode(code: Code): Promise<boolean> {
        const codeIsValid = this.codeState.checkCodeTimeIsValid(code);
        if (!codeIsValid) {
            const res = await this.codeDao.updateCodeState(code.id, this.codeState.CODE_ALREADY_INVALID);
            if (res.changedRows === 1) {
                return false;
            } else {
                throw new Error('update CodeState error');
            }
        }
        return true;
    }

    async creatCode(emailAddress: string): Promise<Code> {
        const codeNum = Math.floor(Math.random() * 1000000);
        const codeStr = `${codeNum}`.padStart(6, '0');
        const code = new Code(null, codeStr, this.codeState.CODE_CAN_USE, new Date().getTime(), emailAddress);
        const res = await this.codeDao.creatCode(code);
        if (res.affectedRows !== 1) {
            throw new Error('creat Code fail');
        } else {
            return code;
        }
    }

    async sendVerificationCode(emailAddress: string): Promise<string> {
        let code = await this.getCode(emailAddress);
        code = code ? await this.checkCode(code) ? code : await this.creatCode(emailAddress) : await this.creatCode(emailAddress);
        const info = await this.email.send(emailAddress, '验证码', `<p>【NODEJS】 您的验证码为 ${code.code} </p>`);
        if (info) {
            return 'success';
        } else {
            return 'send email fail';
        }
    }

    async register(username: string, password: string, emailAddress: string, codeStr: string): Promise<string> {
        const code = await this.getCode(emailAddress);
        if (!await this.checkCode(code)) {
            return '验证码已经过期，请重新获取';
        }
        if (code.code !== codeStr) {
            return '验证码不正确';
        }
        const updateCodeRes = await this.codeDao.updateCodeState(code.id, this.codeState.CODE_ALREADY_USEED);
        if (updateCodeRes.changedRows !== 1) {
            throw new Error('update CodeState error');
        }
        const cryptedPass = this.encryption.encrypt(password);
        const user = new User(null, username, cryptedPass, emailAddress, this.userState.AUTHOR_VISITOR, this.userState.USER_CAN_USE);
        const res = await this.userDao.creatUser(user);
        if (res.affectedRows === 1) {
            return 'success';
        } else {
            return 'register fail';
        }
    }

    async userLeaveUp(id: number): Promise<string> {
        const user = await this.userDao.getUserById(id);
        const currentAuth = user[0].authorization;
        const authObject = this.userState.findAuthor(currentAuth);
        if (!authObject.nextAuthor) {
            return '您的权限已经是最高级别';
        }
        const changePropertyUser = new User(null, null, null, null, authObject.nextAuthor);
        const res = await this.userDao.updateUser(id, changePropertyUser);
        if (res.changedRows === 1) {
            return 'success';
        } else {
            return 'fail';
        }
    }

    async deactivatedUser(userId: number, disableUserId: number): Promise<string> {
        const checkUserAuthorRes = await this.checkUserAuthor(userId);
        if (typeof checkUserAuthorRes === 'string') {
            return checkUserAuthorRes;
        }
        const changePropertyUser = new User(null, null, null, null, null, this.userState.USER_ALREADY_DEACTIVATED);
        const res = await this.userDao.updateUser(disableUserId, changePropertyUser);
        if (res.changedRows === 1) {
            return 'success';
        } else {
            return 'fail';
        }
    }

    async activeedUser(userId: number, changeUserId: number): Promise<string> {
        const checkUserAuthorRes = await this.checkUserAuthor(userId);
        if (typeof checkUserAuthorRes === 'string') {
            return checkUserAuthorRes;
        }
        const changePropertyUser = new User(null, null, null, null, null, this.userState.USER_CAN_USE);
        const res = await this.userDao.updateUser(changeUserId, changePropertyUser);
        if (res.changedRows === 1) {
            return 'success';
        } else {
            return 'fail';
        }
    }


    async checkUsernameCanUser(username: string): Promise<boolean> {
        const user = await this.userDao.getUserByUsername(username);
        return user.length === 0;
    }

    async forgetPassword(username: string): Promise<User | string> {
        const user = await this.userDao.getUserByUsername(username);
        if (user.length === 0) {
            return '用户名不存在';
        }
        const info = await this.sendVerificationCode(user[0].email);
        return info === 'success' ? user[0] : info;
    }

    async setNewPassword(userId: number, password: string): Promise<string> {
        const encryptPassword = this.encryption.encrypt(password);
        const changePropertyUser = new User(null, null, encryptPassword);
        const res = await this.userDao.updateUser(userId, changePropertyUser);
        return res.changedRows === 1 ? 'success' : 'set new password fail';
    }

    async getUser(userId: number, page: number, itemNum: number): Promise<{ users: User[], userCountNumber: number } | string> {
        const checkUserAuthorRes = await this.checkUserAuthor(userId);
        if (typeof checkUserAuthorRes === 'string') {
            return checkUserAuthorRes;
        }
        const users = await this.userDao.getUser(page, itemNum);
        users.forEach(e => {
            delete e.password;
        });
        const userCountNumber = await this.userDao.getConutUserNumber();
        if (userCountNumber.length === 0) {
            throw new Error('not find userCountNumber');
        }
        return { users, userCountNumber: userCountNumber[0].countNum };
    }

    async checkUserAuthor(userId: number): Promise<string | boolean> {
        const user = await this.userDao.getUserById(userId);
        if (user.length === 0) {
            return 'not find user';
        }
        const currentAuth = user[0].authorization;
        if (!this.userState.checkAuthor('user', undefined, currentAuth)) {
            return 'have not authorization';
        }
        return true;
    }

}

