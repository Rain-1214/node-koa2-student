import * as fs from 'fs';
import * as Router from 'koa-router';
import { UserController } from './controller/userController';
import { objectPathMapping, pathMapping, injectArray, singletonWrapper } from './entity/inject';

const addRouter = (router: Router, dir?: string) => {
    dir = dir || './controller';
    fs.readdir(dir, (err: NodeJS.ErrnoException, files: string[]) => {
        if (!err && files) {
            files.forEach((value: string) => {
                if (value.endsWith('.js')) {
                    const fileJs = require(`${dir}/${value}`);
                }
            });
            runInject();
            addMapping(router);
        } else {
            console.log(err);
        }
    });
};

const runInject = () => {
    injectArray.forEach(e => e());
};

const addMapping = (router: Router) => {
    pathMapping.forEach((value, key) => {
        if (key.startsWith('GET ')) {
            const path = key.slice(4);
            router.get(path, value);
        } else if (key.startsWith('POST ')) {
            const path = key.slice(5);
            router.post(path, value);
        }
    });

};

export const addController = (dir?: string) => {

    const router: Router = require('koa-router')();
    addRouter(router, dir);
    return router.routes();

};
