import * as mysql from 'mysql';
import { MysqlPoolManage } from '../conf/mysqlPoolManage';
import { Inject, Dao } from '../entity/inject';
import { Student } from '../entity/student';
import { Grade } from '../entity/grade';
import { ClassNum } from '../entity/class';
import { CommonSql } from '../entity/commonSql';

@Dao()
export class StudentDao {

    @Inject('MysqlPoolManage')
    private sqyPool: MysqlPoolManage;

    @Inject('CommonSql')
    private commonSql: CommonSql;

    getStudent(page: number, itemNumber: number): Promise<Student[]> {
        const sql = 'select * from t_student order by id limit ?,?';
        return this.sqyPool.runSql(sql, [page, itemNumber]);
    }

    getStudentCountNum(): Promise<{countNum: number}[]> {
        const countSql = this.commonSql.count('t_student');
        return this.sqyPool.runSql(countSql);
    }

    getStudentByClassOrGrade(grade: number, classNum?: number): Promise<Student[]> {
        let sql = 'select * from t_student where gradeId = ?';
        const params = [grade];
        if (classNum) {
            sql += ` and classId = ${mysql.escape(classNum)}`;
            params.push(classNum);
        }
        return this.sqyPool.runSql(sql, params);
    }

    getGrade(): Promise<Grade[]> {
        const sql = 'select * from t_grade';
        return this.sqyPool.runSql(sql);
    }

    getClassByGradeId(gradeId: number): Promise<ClassNum[]> {
        const sql = 'select * from t_class where gradeId = ?';
        return this.sqyPool.runSql(sql, [gradeId]);
    }

    addStudent(students: Student[]): Promise<any> {
        let sql = 'insert into t_student values';
        students.forEach((e, i) => {
            sql += `(null,${mysql.escape(e.name)},${mysql.escape(e.studentNumber)}
            ${mysql.escape(e.sex)},${mysql.escape(e.classId)},${mysql.escape(e.gradeId)})`;
            sql += i === students.length - 1 ? '' : ',';
        });
        sql = sql.replace(/undefinde/g, 'null');
        return this.sqyPool.runSql(sql);
    }

    checkStudentNumberRepeat(studentNumber: number): Promise<any> {
        const sql = 'select * from t_student where studentNumber = ?';
        return this.sqyPool.runSql(sql, [studentNumber]);
    }

    updateStudent(student: Student): Promise<any> {
        if (!student['id']) {
            throw new Error('update student must have id property');
        }
        let sql = 'update t_student set ';
        const keys = Object.keys(student);
        keys.forEach((e, i) => {
            if (student[e] && e !== 'id') {
                sql += `${e} = ${mysql.escape(student[e])}`;
                sql += i === keys.length - 1 ? '' : ',';
            }
        });
        sql += ` where id = ?`;
        return this.sqyPool.runSql(sql, [ student.id ]);
    }

    deleteStudent(ids: number[]): Promise<any> {
        let sql = 'delete from t_student where id = ';
        ids.forEach((e, i) => {
            sql += mysql.escape(e);
            sql += i === ids.length ? '' : ' or ';
        });
        return this.sqyPool.runSql(sql);
    }

}


