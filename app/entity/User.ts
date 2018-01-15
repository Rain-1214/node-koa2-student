import { Tool } from './inject';

export class User {
    constructor(
        public id?: number,
        public username?: string,
        public password?: string,
        public email?: string,
        public authorization?: Number
    ) {}
}

@Tool()
export class UserState {
    public CAN_USE = 1;
    public ALREADY_DEACTIVATED = 2;
    public WAIT_ACTIVE = 3;

    public AUTHOR_ROOT = 15;
    public AUTHOR_VIP = 10;
    public AUTHOR_NORMAL = 9;
    public AUTHOR_VISITOR = 5;

}

