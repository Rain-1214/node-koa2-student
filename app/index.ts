import * as koa from 'koa';
import * as bodyparser from 'koa-bodyparser';
import * as session from 'koa-session-minimal';
import { addController } from './controller';

const app = new koa();

app.use(bodyparser());

app.use(session({
    key: 'sid',
    cookie: {
        domain: 'localhost',
        path: '/',
        maxAge: 1000 * 30,
        overwrite: false
    }
}));

app.use(addController());

app.listen(5200);
console.log('Service running on localhost:5200');

