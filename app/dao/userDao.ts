import { User } from '../entity/User';
import { Dao } from '../entity/inject';
import * as mysql from 'mysql';
import mysqlConfig from '../conf/mysql-config';

@Dao()
export class UserDao {

    private sqlConnection: mysql.Connection;
    private findSql = 'select * from t_user';

    constructor() {
        this.sqlConnection = mysql.createConnection({
            host: mysqlConfig.host,
            user: mysqlConfig.user,
            password: mysqlConfig.password,
            database: mysqlConfig.datebase
        });
    }

    connection() {
        this.sqlConnection.connect((err: mysql.MysqlError) => {
            console.log(err);
        });
    }

    close() {
        this.sqlConnection.end((err: mysql.MysqlError) => {
            console.log(err);
        });
    }

    getUserById(id: number) {
        this.connection();
        this.sqlConnection.query(this.findSql, (err: mysql.MysqlError, rows: any, fields: mysql.FieldInfo[]) => {
            console.log(rows);
        });
        this.close();
    }

}
