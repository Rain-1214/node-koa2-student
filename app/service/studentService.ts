import { StudentDao } from '../dao/studentDao';
import { Inject, Service } from '../entity/inject';
import { Student } from '../entity/student';
import { Grade } from '../entity/grade';
import { UserState } from '../entity/User';
import { UserDao } from '../dao/userDao';
import { LogMessage } from '../entity/log';
import { CommonSql } from '../entity/commonSql';

@Service()
export class StudentService {

    @Inject('StudentDao')
    private studentDao: StudentDao;

    @Inject('UserDao')
    private userDao: UserDao;

    @Inject('UserState')
    private userState: UserState;

    @Inject('CommonSql')
    private commonSql: CommonSql;

    @Inject('LogMessage')
    private log: LogMessage;

    async addStudent(uid: number, students: Student[]): Promise<number | string> {
        if (!this.checkUserAuthor(uid, 'add')) {
            return 'Do not have permission';
        }
        for (let i = 0; i < students.length; i++) {
            const element = students[i];
            if (this.checkEmptyProperty(students[i])) {
                return '信息不完整';
            }
            const result = await this.studentDao.checkStudentNumberRepeat(element.studentNumber);
            if (result.length !== 0) {
                return '学号重复';
            }
        }
        const res = await this.studentDao.addStudent(students);
        return res.affectedRows;
    }

    async updateStudent(uid: number, id: number, name: string, studentNumber: number,
                        sex: number, classNum: number, grade: number): Promise<number | string> {
        if (!this.checkUserAuthor(uid, 'update')) {
            return 'Do not have permission';
        }
        const stuNumRepeat = await this.studentDao.checkStudentNumberRepeat(studentNumber);
        if (stuNumRepeat.length > 0) {
            return '学号重复';
        }
        const student = new Student(id, name, studentNumber, sex, classNum, grade);
        const res = await this.studentDao.updateStudent(student);
        return res.changedRows;
    }

    async deleteStudent(uid: number, ids: number[]): Promise<number | string> {
        if (!this.checkUserAuthor(uid, 'delete')) {
            return 'Do not have permission';
        }
        const res = await this.studentDao.deleteStudent(ids);
        return res.affectedRows;
    }

    async getGrade(): Promise<Grade[]> {
        const grades = await this.studentDao.getGrade();
        for (let i = 0; i < grades.length; i++) {
            const classes = await this.studentDao.getClassByGradeId(grades[i].id);
            grades[i].classes = classes;
        }
        return grades;
    }

    async getStudentByGradeAndClass(gradeId: number, classId: number): Promise<Student[]> {
        return this.studentDao.getStudentByClassOrGrade(gradeId, classId);
    }

    async getStudents(page: number): Promise<{students: Student[], countNum: number}> {
        const pageNum = (page - 1) * 6;
        const studentArray = await this.studentDao.getStudent(pageNum, 6);
        const countNum = await this.studentDao.getStudentCountNum();
        return { students: studentArray, countNum: countNum[0].countNum };
    }

    private async checkUserAuthor(userId: number, operationMethod: string): Promise<boolean> {
        const user = await this.userDao.getUserById(userId);
        if (user.length === 0) {
            return false;
        }
        return this.userState.checkAuthor('student', operationMethod, user[0].authorization);
    }

    private checkEmptyProperty(obj: any): boolean {
        const keys = Object.keys(obj);
        return keys.some((e) => {
            return obj[e] === undefined || obj[e] === null;
        });
    }

}

