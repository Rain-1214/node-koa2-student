import * as koa from 'koa';
import { ResultMapping, Inject, Controller } from '../entity/inject';
import { UserService } from '../service/userService';
import { AjaxResult } from '../entity/ajaxResult';
import { User } from '../entity/User';
import { Email } from '../entity/email';
import { Verification } from '../entity/verification';

@Controller()
@ResultMapping('/user')
export class UserController {

    @Inject('UserService')
    private userService: UserService;

    @Inject('Verification')
    private verification: Verification;

    @ResultMapping('/login', 'POST')
    public async login(ctx: koa.Context, next: () => Promise<any>) {
        const username = ctx.request.body.username;
        const password = ctx.request.body.password;
        const res = await this.userService.login(username, password);
        ctx.type = 'application/json; charset=utf-8';
        if (typeof res === 'string') {
            ctx.state = 200;
            ctx.response.body = new AjaxResult(0, res);
        } else {
            ctx.state = 200;
            ctx.body = new AjaxResult(0, 'success', { id: res.id });
        }
    }

}



