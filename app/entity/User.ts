import { Tool } from './inject';

export class User {
    constructor(
        public id?: number,
        public username?: string,
        public password?: string,
        public email?: string,
        public authorization?: number,
        public userState?: number
    ) {}
}

@Tool()
export class UserState {
    public USER_CAN_USE = 1;
    public USER_ALREADY_DEACTIVATED = 2;

    public AUTHOR_ROOT = 15;
    public AUTHOR_VIP = 10;
    public AUTHOR_NORMAL = 9;
    public AUTHOR_VISITOR = 5;

    public Operation_Author = {
        student: {
            'add': 9,
            'update': 9,
            'delete': 10,
        },
        user: {
            'all': 15
        }
    };

    private Author = {
        15: 'root',
        10: 'vip',
        9: 'normal',
        5: 'visitor',
    };

    getUserRole(author: number): string {
        return this.Author[author];
    }


    findAuthor(author: number): { currentAuthor: number, nextAuthor: number, prevAuthor: number } {

        let currentAuthor, nextAuthor, prevAuthor;
        const tempArray = Object.keys(this.Author).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
        console.log(tempArray);
        tempArray.forEach((e, i) => {
            const intE = parseInt(e, 10);
            prevAuthor = i === 0 ? null : Number.parseInt(tempArray[i - 1], 10);
            if (intE === author) {
                currentAuthor = intE;
                nextAuthor = i === tempArray.length - 1 ? null : Number.parseInt(tempArray[i + 1], 10);
            }
        });
        return { currentAuthor, nextAuthor, prevAuthor };

    }

    checkAuthor(operationTable: string, operationMehtod: string = 'all', author: number): boolean {
        if (!operationTable) {
            throw new Error('check author: operationTable is require');
        }
        console.log(author);
        console.log(this.Operation_Author[operationTable][operationMehtod]);
        return author >= this.Operation_Author[operationTable][operationMehtod];
    }

}

