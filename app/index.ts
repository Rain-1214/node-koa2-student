import * as koa from 'koa';
import { addController } from './controller';

const app = new koa();

app.use(addController());

app.listen(5200);
console.log('Service running on localhost:5200');

