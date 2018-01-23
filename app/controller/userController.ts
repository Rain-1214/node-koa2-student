import * as koa from 'koa';
import { ResultMapping, Inject, Controller } from '../entity/inject';
import { UserService } from '../service/userService';
import { AjaxResult } from '../entity/ajaxResult';
import { User } from '../entity/User';
import { Email } from '../entity/email';
import { Verification } from '../entity/verification';
import { Encryption } from '../entity/encryption';

@Controller()
@ResultMapping('/user')
export class UserController {

    @Inject('UserService')
    private userService: UserService;

    @Inject('Verification')
    private verification: Verification;

    @Inject('Encryption')
    private encryption: Encryption;

    @ResultMapping('/login', 'POST')
    public async login(ctx: koa.Context, next: () => Promise<any>) {
        const { username, password } = ctx.request.body;
        const res = await this.userService.login(username, password);
        if (typeof res === 'string') {
            ctx.state = 200;
            ctx.response.body = new AjaxResult(0, res);
        } else {
            const uid = this.encryption.encrypt(`${res.id}`);
            ctx.state = 200;
            ctx.session.uid = res.id;
            ctx.response.body = new AjaxResult(0, 'success');
        }
    }

    @ResultMapping('/getEmailCode', 'POST')
    public async getEmailCode(ctx: koa.Context, next: () => Promise<any>) {
        const email = ctx.request.body.email;
        if (!this.verification.email(email)) {
            ctx.state = 200;
            ctx.response.body = new AjaxResult(0, '无效的邮箱地址');
        } else {
            const info = await this.userService.sendVerificationCode(email);
            ctx.state = 200;
            ctx.response.body = new AjaxResult(1, info);
        }
    }

    @ResultMapping('/register', 'PUT')
    public async register(ctx: koa.Context, next: () => Promise<any>) {
        const { username, password, email, code } = ctx.request.body;
        const res = await this.userService.register(username, password, email, code);
        const resultState = res === 'success' ? 1 : 0;
        ctx.state = resultState;
        ctx.response.body = new AjaxResult(resultState, res);
    }

    @ResultMapping('/getUser')
    public async getUser(ctx: koa.Context, next: () => Promise<any>) {
        const userId = ctx.session.uid;
        let { page, itemNumber } = ctx.query;
        page = +page;
        itemNumber = +itemNumber;
        if (!userId) {
            ctx.state = 200;
            ctx.response.body = new AjaxResult(0, 'must login');
        }
        const res = await this.userService.getUser(userId, page, itemNumber);
        ctx.state = 200;
        ctx.response.body = new AjaxResult(1, 'success', res);
    }

    @ResultMapping('/forgetPass', 'POST')
    public async forgetPassword(ctx: koa.Context, next: () => Promise<any>) {
        const username = ctx.request.body.username;
        const res = await this.userService.forgetPassword(username);
        if (typeof res === 'string') {
            ctx.state = 200;
            ctx.response.body = new AjaxResult(0, res);
        } else {
            ctx.session.forgetPassUserId = res.id;
            ctx.state = 200;
            ctx.response.body = new AjaxResult(1, 'success', res.email);
        }
    }

    @ResultMapping('/setNewPass', 'POST')
    public async setNewPass(ctx: koa.Context, next: () => Promise<any>) {
        const password = ctx.request.body.password;
        const forgetPassUserId = ctx.session.forgetPassUserId;
        if (!forgetPassUserId) {
            ctx.state = 200;
            ctx.response.body = new AjaxResult(0, 'not find userId');
        }
        const res = await this.userService.setNewPassword(forgetPassUserId, password);
        const resultState = res === 'success' ? 1 : 0;
        ctx.state = 200;
        ctx.response.body = new AjaxResult(resultState, res);
    }

    @ResultMapping('/disableUser', 'POST')
    public async disableUser(ctx: koa.Context, next: () => Promise<any>) {
        const disableUserId = ctx.request.body.userId;
        const uid = ctx.session.uid;
        if (!uid) {
            ctx.state = 200;
            ctx.response.body = new AjaxResult(0, 'must login');
        }
        const res = await this.userService.deactivatedUser(uid, disableUserId);
        const resultState = res === 'success' ? 1 : 0;
        ctx.state = 200;
        ctx.response.body = new AjaxResult(resultState, res);
    }

    @ResultMapping('/activeUser', 'POST')
    public async activeUser(ctx: koa.Context, next: () => Promise<any>) {
        const activeUserId = ctx.request.body.userId;
        const uid = ctx.session.uid;
        if (!uid) {
            ctx.state = 200;
            ctx.response.body = new AjaxResult(0, 'Lack of essential property');
        }
        const res = await this.userService.activeedUser(uid, activeUserId);
        const resultState = res === 'success' ? 1 : 0;
        ctx.state = 200;
        ctx.response.body = new AjaxResult(resultState, res);
    }

    @ResultMapping('/checkUsername', 'POST')
    public async checkUsernameCanUser(ctx: koa.Context, next: () => Promise<any>) {
        const username = ctx.request.body.username;
        const res = await this.userService.checkUsernameCanUser(username);
        const message = res ? '用户名可用' : '用户名不可用';
        ctx.state = 200;
        ctx.response.body = new AjaxResult(1, message);
    }


    public async leaveUpUserAuthor(ctx: koa.Context, next: () => Promise<any>) {
        const uid = ctx.session.uid;
        if (!uid) {
            ctx.state = 200;
            ctx.response.body = new AjaxResult(0, 'Lack of essential property');
        }
        const res = await this.userService.userLeaveUp(uid);
        const resultState = res === 'success' ? 1 : 0;
        ctx.state = 200;
        ctx.response.body = new AjaxResult(resultState, res);
    }

}



