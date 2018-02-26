import * as koa from 'koa';
import { ResultMapping, Inject, Controller } from '../entity/inject';
import { UserService } from '../service/userService';
import { AjaxResult } from '../entity/ajaxResult';
import { User } from '../entity/User';
import { Email } from '../entity/email';
import { Verification } from '../entity/verification';
import { Encryption } from '../entity/encryption';
import { LogMessage } from '../entity/log';

@Controller()
@ResultMapping('/api/user')
export class UserController {

    @Inject('UserService')
    private userService: UserService;

    @Inject('Verification')
    private verification: Verification;

    @Inject('Encryption')
    private encryption: Encryption;

    @Inject('LogMessage')
    private log: LogMessage;

    @ResultMapping('/login', 'POST')
    public async login(ctx: koa.Context, next: () => Promise<any>) {
        const { username, password } = ctx.request.body;
        if (!this.checkParams(ctx, username, password)) {
            return;
        }
        const res = await this.userService.login(username, password);
        if (typeof res === 'string') {
            ctx.state = 200;
            ctx.response.body = new AjaxResult(0, res);
        } else {
            const uid = res.id;
            ctx.state = 200;
            ctx.session.uid = res.id;
            ctx.response.body = new AjaxResult(1, 'success');
        }
    }

    @ResultMapping('/logout')
    public async logout(ctx: koa.Context, next: () => Promise<any>) {
        const uid = ctx.session.uid;
        if (!uid) {
            this.log.logMessage('没有找到登录信息，无法登出');
            ctx.state = 200;
            ctx.response.body = new AjaxResult(0, 'have not login information');
            return;
        }
        this.log.logMessage(`用户ID${ctx.session.uid}登出`);
        delete ctx.sessiond.uid;
        ctx.state = 200;
        ctx.response.body = new AjaxResult(1, 'success');
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
        if (!this.checkParams(ctx, username, password, email, code)) {
            return;
        }
        const res = await this.userService.register(username, password, email, code);
        const resultState = typeof res === 'number' ? 1 : 0;
        if (resultState) {
            ctx.session.uid = res;
            this.log.logMessage(`新用户ID：${ctx.session.uid}`);
        }
        ctx.state = 200;
        ctx.response.body = new AjaxResult(resultState, res);
    }

    @ResultMapping('/getUser')
    public async getUser(ctx: koa.Context, next: () => Promise<any>) {
        const userId = ctx.session.uid;
        let { page, itemNumber } = ctx.query;
        if (!this.checkParams(page, itemNumber)) {
            return;
        }
        page = +page;
        itemNumber = +itemNumber;
        if (!userId) {
            ctx.state = 200;
            ctx.response.body = new AjaxResult(0, 'must login');
            return;
        }
        const res = await this.userService.getUser(userId, page, itemNumber);
        ctx.state = 200;
        ctx.response.body = new AjaxResult(1, 'success', res);
    }

    @ResultMapping('/forgetPass', 'POST')
    public async forgetPassword(ctx: koa.Context, next: () => Promise<any>) {
        const username = ctx.request.body.username;
        if (!this.checkParams(ctx, username)) {
            return;
        }
        const res = await this.userService.forgetPassword(username);
        if (typeof res === 'string') {
            ctx.state = 200;
            ctx.response.body = new AjaxResult(0, res);
            return;
        } else {
            ctx.session.forgetPass = { id: res.id, email: res.email };
            this.log.logMessage(`忘记密码的用户ID和邮箱${res.id},${res.email}`);
            const returnEmail = this.encryption.encryptEmail(res.email);
            ctx.state = 200;
            ctx.response.body = new AjaxResult(1, 'success', returnEmail);
        }
    }

    @ResultMapping('/checkForgetPassCode', 'POST')
    public async checkForgetPassCode(ctx: koa.Context, next: () => Promise<any>) {
        const code = ctx.request.body.code;
        const email = ctx.session.forgetPass.email;
        if (!this.checkParams(ctx, code)) {
            return;
        }
        this.log.logMessage(`忘记密码用户的验证码和邮箱${code},${email}`);
        const res = await this.userService.checkCodeRight(email, code);
        const resultState = res === 'success' ? 1 : 0;
        ctx.state = 200;
        ctx.response.body = new AjaxResult(resultState, res);
    }

    @ResultMapping('/setNewPass', 'POST')
    public async setNewPass(ctx: koa.Context, next: () => Promise<any>) {
        const password = ctx.request.body.password;
        const forgetPassUserId = ctx.session.forgetPass.id;
        if (!this.checkParams(ctx, password)) {
            return;
        }
        this.log.logMessage(`忘记密码的用户的ID和修改的新密码${forgetPassUserId},${password}`);
        if (!forgetPassUserId) {
            ctx.state = 200;
            ctx.response.body = new AjaxResult(0, 'not find userId');
            return;
        }
        const res = await this.userService.setNewPassword(forgetPassUserId, password);
        const resultState = res === 'success' ? 1 : 0;
        if (resultState) {
            delete ctx.session.forgetPass;
        }
        ctx.state = 200;
        ctx.response.body = new AjaxResult(resultState, res);
    }

    @ResultMapping('/disableUser', 'POST')
    public async disableUser(ctx: koa.Context, next: () => Promise<any>) {
        const disableUserId = ctx.request.body.userId;
        if (!this.checkParams(ctx, disableUserId)) {
            return;
        }
        const uid = ctx.session.uid;
        if (!uid) {
            ctx.state = 200;
            ctx.response.body = new AjaxResult(0, 'must login');
            return;
        }
        const res = await this.userService.deactivatedUser(uid, disableUserId);
        const resultState = res === 'success' ? 1 : 0;
        ctx.state = 200;
        ctx.response.body = new AjaxResult(resultState, res);
    }

    @ResultMapping('/activeUser', 'POST')
    public async activeUser(ctx: koa.Context, next: () => Promise<any>) {
        const activeUserId = ctx.request.body.userId;
        if (this.checkParams(ctx, activeUserId)) {
            return;
        }
        const uid = ctx.session.uid;
        if (!uid) {
            ctx.state = 200;
            ctx.response.body = new AjaxResult(0, 'Lack of essential property');
            return;
        }
        const res = await this.userService.activeedUser(uid, activeUserId);
        const resultState = res === 'success' ? 1 : 0;
        ctx.state = 200;
        ctx.response.body = new AjaxResult(resultState, res);
    }

    @ResultMapping('/checkUsername', 'POST')
    public async checkUsernameCanUser(ctx: koa.Context, next: () => Promise<any>) {
        const username = ctx.request.body.username;
        if (!this.checkParams(ctx, username)) {
            return;
        }
        const res = await this.userService.checkUsernameCanUse(username);
        const message = res ? '用户名可用' : '用户名不可用';
        const stateCode = res ? 1 : 0;
        ctx.state = 200;
        ctx.response.body = new AjaxResult(stateCode, message);
    }

    @ResultMapping('/leaveUpUser', 'POST')
    public async leaveUpUserAuthor(ctx: koa.Context, next: () => Promise<any>) {
        const uid = ctx.session.uid;
        if (!uid) {
            ctx.state = 200;
            ctx.response.body = new AjaxResult(0, 'Lack of essential property');
            return;
        }
        const res = await this.userService.userLeaveUp(uid);
        const resultState = res === 'success' ? 1 : 0;
        ctx.state = 200;
        ctx.response.body = new AjaxResult(resultState, res);
    }

    private checkParams(ctx: koa.Context, ...params: any[]): boolean {
        if (params.some(e => {
            const value = typeof e === 'object' ? Object.values(e) : e;
            return !this.verification.require(value);
        })) {
            ctx.state = 200;
            ctx.response.body = new AjaxResult(0, 'invalid arguments');
            return false;
        }
        return true;
    }

}



