import { Tool } from './inject';

@Tool()
export class CommonSql {

    count(table: string): string {
        return `select count(1) as countNum from ${table}`;
    }

}

