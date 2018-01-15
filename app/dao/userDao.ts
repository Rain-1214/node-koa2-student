import { User, UserState } from '../entity/User';
import { Dao, Inject } from '../entity/inject';
import * as mysql from 'mysql';
import mysqlConfig from '../conf/mysql-config';
import { MysqlPoolManage } from '../conf/mysqlPoolManage';

@Dao()
export class UserDao {

    private sqlPool: mysql.Pool;

    @Inject('UserState')
    private userState: UserState;

    @Inject('MysqlPoolManage')
    private mysqlManage: MysqlPoolManage;

    getUserById(id: number): Promise<User[]> {
        const sql = 'select * from t_user where id = ?';
        return this.runSql(sql, [id]);
    }

    getUserByUsername(username: string): Promise<User[]> {
        const sql = 'select * from t_user where username = ?';
        return this.runSql(sql, [username]);
    }

    getUser(page: number, itemNumber: number): Promise<User[]> {
        const sql = 'select * from t_user order by id limit ?,?';
        return this.runSql(sql, [page, itemNumber]);
    }

    updateUser(id: number, changeProperty: User): Promise<any> {
        let sql = 'update t_user set ';
        const keys = Object.keys(changeProperty);
        keys.forEach(e => {
            if (changeProperty[e]) {
                sql += `${e} = ${mysql.escape(changeProperty[e])} `;
            }
        });
        sql += `where id = ?`;
        return this.runSql(sql, [id]);
    }

    creatUser(user: User): Promise<any> {
        let sql = 'insert into t_user values(null,';
        const keys = Object.keys(user);
        keys.forEach((e, i) => {
            sql += user[e] ? mysql.escape(user[e]) : 'null';
            sql += i === keys.length - 1 ? '' : ',';
        });
        sql += ')';
        return this.runSql(sql);
    }

    async runSql(sql: string, params?: any[]): Promise<any> {
        const connection = await this.mysqlManage.getConnection();
        return new Promise((resolve, reject) => {
            connection.query(sql, params, (err: mysql.MysqlError, rows: any, fields: mysql.FieldInfo[]) => {
                connection.release();
                if (err) {
                    reject(err);
                    throw err;
                } else {
                    resolve(rows);
                }
            });
        });
    }

}
