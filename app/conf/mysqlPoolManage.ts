import * as mysql from 'mysql';
import mysqlConfig from './mysql-config';
import { Tool } from '../entity/inject';

@Tool()
export class MysqlPoolManage {

    private _mysqlPool: mysql.Pool;

    constructor() {
        this.createPool();
        this._mysqlPool.on('error', (err: mysql.MysqlError) => {
            this.createPool();
        });
    }

    private createPool() {
        this._mysqlPool = mysql.createPool({
            connectionLimit: 10,
            host: mysqlConfig.host,
            user: mysqlConfig.user,
            password: mysqlConfig.password,
            database: mysqlConfig.datebase
        });
    }

    close() {
        this._mysqlPool.end((err: mysql.MysqlError) => {
            throw err;
        });
    }

    get mysqlPool() {
        return this._mysqlPool;
    }

    getConnection(): Promise<mysql.PoolConnection> {
        return new Promise((resolve, reject) => {
            this._mysqlPool.getConnection((err: mysql.MysqlError, connection: mysql.PoolConnection) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(connection);
                }
            });
        });
    }

}

