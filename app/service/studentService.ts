import { StudentDao } from '../dao/studentDao';
import { Inject, Service } from '../entity/inject';
import { Student } from '../entity/student';
import { Grade } from '../entity/grade';
import { UserState } from '../entity/User';
import { UserDao } from '../dao/userDao';

@Service()
export class StudentService {

    @Inject('StudentDao')
    private studentDao: StudentDao;

    @Inject('UserDao')
    private userDao: UserDao;

    @Inject('UserState')
    private userState: UserState;

    async addStudent(uid: number, students: Student[]): Promise<number | string> {
        if (!this.checkUserAuthor(uid, 'add')) {
            return 'Do not have permission';
        }
        const res = await this.studentDao.addStudent(students);
        return res.affectedRows;
    }

    async updateStudent(uid: number, id: number, name: string, studentNumber: number,
                        sex: number, classNum: number, grade: number): Promise<number | string> {
        if (!this.checkUserAuthor(uid, 'update')) {
            return 'Do not have permission';
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
        grades.forEach(async (e) => {
            const classes = await this.studentDao.getClassByGradeId(e.id);
            e.classes = classes;
        });
        return grades;
    }

    async getStudentByGradeAndClass(gradeId: number, classId: number): Promise<Student[]> {
        return this.studentDao.getStudentByClassOrGrade(gradeId, classId);
    }

    async getStudents(page: number): Promise<Student[]> {
        return this.studentDao.getStudent(page, 8);
    }

    private async checkUserAuthor(userId: number, operationMethod: string): Promise<boolean> {
        const user = await this.userDao.getUserById(userId);
        if (user.length === 0) {
            return false;
        }
        return this.userState.checkAuthor('student', operationMethod, user[0].authorization);
    }

}

