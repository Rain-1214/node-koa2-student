import { User } from '../entity/User';
import { Dao, Inject } from '../entity/inject';
import * as mysql from 'mysql';
import mysqlConfig from '../conf/mysql-config';
import { MysqlPoolManage } from '../conf/mysqlPoolManage';
import { CommonSql } from '../entity/commonSql';

@Dao()
export class UserDao {

    @Inject('CommonSql')
    private commonSql: CommonSql;

    @Inject('MysqlPoolManage')
    private mysqlManage: MysqlPoolManage;

    getUserById(id: number): Promise<User[]> {
        const sql = 'select * from t_user where id = ?';
        return this.mysqlManage.runSql(sql, [id]);
    }

    getUserByUsername(username: string): Promise<User[]> {
        const sql = 'select * from t_user where username = ?';
        return this.mysqlManage.runSql(sql, [username]);
    }

    getUser(page: number, itemNumber: number): Promise<User[]> {
        const sql = 'select * from t_user order by id limit ?,?';
        return this.mysqlManage.runSql(sql, [page, itemNumber]);
    }

    getConutUserNumber(): Promise<{countNum: number}[]> {
        const sql = this.commonSql.count('t_user');
        return this.mysqlManage.runSql(sql);
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
        return this.mysqlManage.runSql(sql, [id]);
    }

    creatUser(user: User): Promise<any> {
        let sql = 'insert into t_user values(';
        const keys = Object.keys(user);
        keys.forEach((e, i) => {
            sql += user[e] ? mysql.escape(user[e]) : 'null';
            sql += i === keys.length - 1 ? '' : ',';
        });
        sql += ')';
        return this.mysqlManage.runSql(sql);
    }

}
