import * as koa from 'koa';
import { ResultMapping, Inject, Controller } from '../entity/inject';
import { UserService } from '../service/userService';

@Controller()
export class UserController {

    id = 1;

    @Inject('UserService')
    private userService: UserService;

    @ResultMapping('/user/:id')
    getUser(ctx: koa.Context, next: () => Promise<any>) {
        const id = ctx.params.id;
        console.log(id);
        console.log(this.id);
        this.userService.findUserById(id);
        ctx.body = `Id is ${id}`;
    }


}



