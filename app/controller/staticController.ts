import { Controller, ResultMapping } from '../entity/inject';
import * as koa from 'koa';
import * as fs from 'fs';
import * as path from 'path';

@Controller()
export class StaticController {

  @ResultMapping('/*', 'GET')
  async handleStaticFile (ctx: koa.Context, next: () => void) {
    if (ctx.path.includes('.')) {
      const rootPathArray = __dirname.split('\\');
      rootPathArray.pop();
      const rootPath = path.join(...rootPathArray);
      if (ctx.path.endsWith('.css')) {
        ctx.response.set('Content-Type', 'text/css');
      }
      ctx.body = fs.createReadStream(rootPath + ctx.path);
      return;
    } else if (ctx.path.startsWith('/api')) {
      await next();
    } else {
      return ctx.render('/index.html');
    }
  }

}
