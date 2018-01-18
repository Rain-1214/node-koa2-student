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

    @ResultMapping('/getUser')
    public async getUser(ctx: koa.Context, next: () => Promise<any>) {
        const userId = ctx.session.uid;
        const { page, itemNumber } = ctx.params;
        if (!userId) {
            ctx.state = 200;
            ctx.response.body = new AjaxResult(0, 'must login');
        }
        const res = await this.userService.getUser(userId, page, itemNumber);
        ctx.state = 200;
        ctx.response.body = new AjaxResult(1, 'success', res);
    }

}



