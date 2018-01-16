import * as mysql from 'mysql';
import { MysqlPoolManage } from '../conf/mysqlPoolManage';
import { Inject } from '../entity/inject';
import { Student } from '../entity/student';
import { Grade } from '../entity/grade';
import { ClassNum } from '../entity/class';

export class StudentDao {

    @Inject('MysqlPoolManage')
    private sqyPool: MysqlPoolManage;

    getStudent(page: number, itemNumber: number): Promise<Student[]> {
        const sql = 'select * from t_student order by id limit ?,?';
        return this.sqyPool.runSql(sql, [page, itemNumber]);
    }

    getStudentByClassOrGrade(grade?: number, classNum?: number): Promise<Student[]> {
        if (!grade && !classNum) {
            throw new Error('both of grade and classnum is null');
        }
        let sql = 'select * from t_student where ';
        const params = [];
        if (grade) {
            sql += `gradeId = ${mysql.escape(grade)}`;
            params.push(grade);
        }

        if (classNum) {
            sql += ` and classId = ${mysql.escape(classNum)}`;
            params.push(classNum);
        }

        return this.sqyPool.runSql(sql, [grade, classNum]);
    }

    getGrade(): Promise<Grade[]> {
        const sql = 'select * from t_grade';
        return this.sqyPool.runSql(sql);
    }

    getClassByGradeId(gradeId: number): Promise<ClassNum[]> {
        const sql = 'select * from t_class where gradeId = ?';
        return this.sqyPool.runSql(sql, [gradeId]);
    }

    addStudent(student: Student): Promise<any> {
        const sql = `insert into t_student values(null,${mysql.escape(student.name)},${mysql.escape(student.studentNumber)}
                   ${mysql.escape(student.sex)},${mysql.escape(student.classId)},${mysql.escape(student.gradeId)})`;
        const newSql = sql.replace(/undefined/g, 'null');
        return this.sqyPool.runSql(newSql);
    }

    addStudents(students: Student[]): Promise<any> {
        let sql = 'insert into t_student values';
        students.forEach((e, i) => {
            sql += `(null,${mysql.escape(e.name)},${mysql.escape(e.studentNumber)}
            ${mysql.escape(e.sex)},${mysql.escape(e.classId)},${mysql.escape(e.gradeId)})`;
            sql += i === students.length - 1 ? '' : ',';
        });
        sql = sql.replace(/undefinde/g, 'null');
        return this.sqyPool.runSql(sql);
    }

    updateStudent(student: Student): Promise<any> {
        if (!student['id']) {
            throw new Error('update student must have id property');
        }
        let sql = 'update t_student set';
        const keys = Object.keys(student);
        keys.forEach((e, i) => {
            if (student[e]) {
                sql += `${e} = ${mysql.escape(student[e])} `;
            }
        });
        sql += `where id = ${mysql.escape(student['id'])}`;
        return this.sqyPool.runSql(sql);
    }

    deleteStudent(id: number): Promise<any> {
        const sql = 'delete from t_student where id = ?';
        return this.sqyPool.runSql(sql, [id]);
    }

}


