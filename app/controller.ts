import * as fs from 'fs';
import * as Router from 'koa-router';
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
            console.log('GET:' + path);
            router.get(path, value);
        } else if (key.startsWith('POST ')) {
            const path = key.slice(5);
            console.log('POST:' + path);
            router.post(path, value);
        } else if (key.startsWith('PUT ')) {
            const path = key.slice(4);
            console.log('PUT:' + path);
            router.put(path, value);
        } else if (key.startsWith('DELETE ')) {
            const path = key.slice(7);
            console.log('DELETE:' + path);
            router.delete(path, value);
        } else if (key.startsWith('HEAD ')) {
            const path = key.slice(5);
            console.log('HEAD:' + path);
            router.head(path, value);
        } else {
            throw new Error('invalid request method name');
        }
    });

};

export const addController = (dir?: string) => {

    const router: Router = require('koa-router')();
    addRouter(router, dir);
    return router.routes();

};
