import { Tool } from './inject';


export class Code {

    constructor(
        public id?: number,
        public code?: string,
        public state?: number,
        public time?: number,
        public email?: string
    ) {}

}

@Tool()
export class CodeState {
    public CODE_CAN_USE = 1;
    public CODE_ALREADY_USEED = 2;
    public CODE_ALREADY_INVALID = 3;

    public checkCodeTimeIsValid(code: Code): boolean {
        const currentTime = Math.floor(new Date().getTime() / 1000);
        return (currentTime - code.time) < (24 * 60 * 60);
    }
}



