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

    id = 1;

    @Inject('UserService')
    private userService: UserService;

    @Inject('Email')
    private email: Email;

    @Inject('Verification')
    private verification: Verification;

    @ResultMapping('/:id')
    async getUser(ctx: koa.Context, next: () => Promise<any>) {
        const id = ctx.params.id;
        console.log(id);
        const result = await this.userService.findUserById(id);
        if (result && result.length !== 0) {
            ctx.body = new AjaxResult(1, 'success', result);
        } else {
            ctx.state = 404;
        }
    }

    @ResultMapping('/update/:id')
    async updateUser(ctx: koa.Context, next: () => Promise<any>) {
        const id = ctx.params.id;
        const result = await this.userService.updateUser(id, new User(null, 'bbb'));
        ctx.body = `${result}`;
    }

    @ResultMapping('/add/user')
    async addUser(ctx: koa.Context, next: () => Promise<any>) {
        const user = new User(null, 'asdf');
        const result = await this.userService.creatUser(user);
        ctx.body = result;
    }

    @ResultMapping('/email/send')
    sendEmail(ctx: koa.Context, next: () => Promise<any>) {
        // this.email.send('453430651@qq.com');
        ctx.body = 'success';
    }

}



