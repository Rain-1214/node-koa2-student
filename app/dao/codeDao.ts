import * as mysql from 'mysql';
import { MysqlPoolManage } from '../conf/mysqlPoolManage';
import { Inject, Dao } from '../entity/inject';
import { Code } from '../entity/Code';

@Dao()
export class CodeDao {

    @Inject('MysqlPoolManage')
    private sqlPool: MysqlPoolManage;

    creatCode(code: Code): Promise<any> {
        const sql = `insert into t_code values(null,
            ${mysql.escape(code.code)},${mysql.escape(code.state)},${mysql.escape(code.time)},${mysql.escape(code.email)})`;
        return this.sqlPool.runSql(sql);
    }

    getCodeByCode(code: string): Promise<Code[]> {
        const sql = 'select * from t_code where code = ?';
        return this.sqlPool.runSql(sql, [code]);
    }

    getCodeByEmailAndState(email: string, state: number): Promise<Code[]> {
        const sql = 'select * from t_code where binary email = ? and state = ?';
        return this.sqlPool.runSql(sql, [email, state]);
    }

    updateCodeState(id: number, codeState: number): Promise<any> {
        const sql = 'update t_code set state = ? where id = ?';
        return this.sqlPool.runSql(sql, [codeState, id]);
    }

}

