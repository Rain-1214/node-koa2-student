import * as koa from 'koa';
import { ResultMapping, Inject, Controller } from '../entity/inject';
import { UserService } from '../service/userService';

@Controller()
export class UserController {

    @Inject('UserService')
    private userService: UserService;

    @ResultMapping('/user/:id')
    getUser(ctx: koa.Context, next: () => Promise<any>) {
        const id = ctx.params.id;
        console.log(id);
        this.userService.findUserById(id);
        ctx.body = `Id is ${id}`;
    }


}



