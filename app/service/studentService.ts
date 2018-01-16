import { StudentDao } from '../dao/studentDao';
import { Inject } from '../entity/inject';
import { Student } from '../entity/student';
import { Grade } from '../entity/grade';


export class StudentService {

    @Inject('StudentDao')
    private studentDao: StudentDao;

    async addStudent(student: Student): Promise<number> {
        const res = await this.studentDao.addStudent(student);
        return res.affectedRows;
    }

    async addStudents(students: Student[]): Promise<number> {
        const res = await this.studentDao.addStudents(students);
        return res.affectedRows;
    }

    async updateStudent(id: number, name: string, studentNumber: number, sex: number, classNum, grade: number): Promise<number> {
        const student = new Student(id, name, studentNumber, sex, classNum, grade);
        const res = await this.studentDao.updateStudent(student);
        return res.changedRows;
    }

    async deleteStudent(id: number): Promise<number> {
        const res = await this.studentDao.deleteStudent(id);
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

    async getStudnet(gradeId: number, classId: number): Promise<Student[]> {
        return this.studentDao.getStudentByClassOrGrade(gradeId, classId);
    }

    async getStudents(page: number): Promise<Student[]> {
        return this.studentDao.getStudent(page, 8);
    }

}

