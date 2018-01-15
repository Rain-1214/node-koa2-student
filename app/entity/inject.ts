import * as koa from 'koa';
interface SingletonClass {
    method: string;
    path: string;
}

export const objectPathMapping = new Map<string, SingletonClass>();
export const singletonWrapper = new Map<string, any>();
export const pathMapping = new Map<string, (ctx: koa.Context, next: () => Promise<any>) => any>();
export const injectArray = [];

export const ResultMapping = (path: string, method?: string) => {
    return (target: any, name?: string, descriptor?: any) => {
        if (name === undefined) {
            method = method ? method : null;
            const className = target.name;
            if (!Object.prototype.hasOwnProperty.call(objectPathMapping, className)) {
                objectPathMapping.set(className, {
                    method,
                    path,
                });
            }
        } else {
            const className = target.constructor.name;
            injectArray.push(() => {
                method = method ? method : objectPathMapping.has(className) ?
                                           objectPathMapping.get(className).method ?
                                           objectPathMapping.get(className).method : 'GET' : 'GET';
                const prefixPath = objectPathMapping.has(className) ? objectPathMapping.get(className).path : '';
                const completePath = prefixPath + path;
                if (pathMapping.has(completePath)) {
                    throw new Error('router path repeat');
                } else {
                    pathMapping.set(`${method} ${completePath}`,
                        singletonWrapper.get(className)[name].bind(singletonWrapper.get(className)));
                }
            });
        }
    };
};

export const Inject = (className: string) => {
    return (target: any, name?: string, descriptor?: any) => {
        if (name === undefined) {
            throw new Error('@Inject only at method/property of class');
        } else {
            const currentClassName = target.constructor.name;
            injectArray.push(() => {
                singletonWrapper.get(currentClassName)[name] = singletonWrapper.get(className);
            });
        }

    };
};

const singletonFunction = () => {
    return (target: any) => {
        const className = target.name;
        if (!singletonWrapper.has(className)) {
            singletonWrapper.set(className, new target());
        }
    };
};

export { singletonFunction as Controller };
export { singletonFunction as Service };
export { singletonFunction as Dao };


