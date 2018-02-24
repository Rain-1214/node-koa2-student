import { Tool } from './inject';


@Tool()
export class Verification {

    email(emailAddress: string): boolean {
        const reg = /^[\w\-]+[\.\w\-]*@[\w\-]+[\.\w\-]+$/;
        return reg.test(emailAddress);
    }

    require(...arg: any[]): boolean {
        if (arg.length <= 0) {
            return false;
        }
        return arg.every((e) => {
           return e !== null && e !== undefined && e !== '';
        });
    }

}

