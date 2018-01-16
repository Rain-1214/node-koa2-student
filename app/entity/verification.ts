import { Tool } from './inject';


@Tool()
export class Verification {

    email(emailAddress: string): boolean {
        const reg = /^[\w\-]+[\.\w\-]*@[\w\-]+[\.\w\-]+$/;
        return reg.test(emailAddress);
    }


}

