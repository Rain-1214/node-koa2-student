import * as koa from 'koa';
import { Controller, ResultMapping, Inject } from '../entity/inject';
import { StudentService } from '../service/studentService';
import { AjaxResult } from '../entity/ajaxResult';
import { Student } from '../entity/student';
import { Verification } from '../entity/verification';
import { LogMessage } from '../entity/log';


@Controller()
@ResultMapping('/api/student')
export class StudentController {

    @Inject('StudentService')
    private studentService: StudentService;

    @Inject('Verification')
    private verification: Verification;

    @Inject('LogMessage')
    private log: LogMessage;

    @ResultMapping('/getGrade')
    public async getGrade(ctx: koa.Context, next: () => Promise<any>) {
        if (!this.checkUserLogin(ctx)) {
            return;
        }
        this.log.logMessage(`用户ID为${ctx.session.uid}的用户获取了年级信息`);
        const res = await this.studentService.getGrade();
        ctx.state = 200;
        ctx.response.body = new AjaxResult(1, 'success', res);
    }

    @ResultMapping('/getStuBygidcid', 'POST')
    public async getStudentByGradeAndClass(ctx: koa.Context, next: () => Promise<any>) {
        if (!this.checkUserLogin(ctx)) {
            return;
        }
        const { gradeId, classId } = ctx.request.body;
        const res = await this.studentService.getStudentByGradeAndClass(gradeId, classId);
        ctx.state = 200;
        ctx.response.body = new AjaxResult(1, 'success', res);
    }

    @ResultMapping('/getStudent')
    public async getStudent(ctx: koa.Context, next: () => Promise<any>) {
        if (!this.checkUserLogin(ctx)) {
            return;
        }
        const page = +ctx.query.page;
        const res = await this.studentService.getStudents(page);
        ctx.state = 200;
        ctx.response.body = new AjaxResult(1, 'success', res);
    }

    @ResultMapping('/addStudent', 'PUT')
    public async addStudent(ctx: koa.Context, next: () => Promise<any>) {
        if (!this.checkUserLogin(ctx)) {
            return;
        }
        const uid = ctx.session.uid;
        const students: Student[] = ctx.request.body.students;
        this.log.logMessage(`添加的学生为：`);
        this.log.logMessage(students);
        if (students.length <= 0) {
            this.returnResponse('添加的学生为空', ctx);
        }
        if (!this.checkParams(ctx, students)) {
            return;
        }
        const res = await this.studentService.addStudent(uid, students);
        this.returnResponse(res, ctx);
    }

    @ResultMapping('/updateStudent', 'POST')
    public async updateStudent(ctx: koa.Context, next: () => Promise<any>) {
        if (!this.checkUserLogin(ctx)) {
            return;
        }
        const uid = ctx.session.uid;
        const { id, name, studentNumber, sex, classId, gradeId } = ctx.request.body;
        this.checkParams(ctx, id);
        const res = await this.studentService.updateStudent(uid, id, name, studentNumber, sex, classId, gradeId);
        this.returnResponse(res, ctx);
    }

    @ResultMapping('/deleteStudent', 'POST')
    public async deleteStudent(ctx: koa.Context, next: () => Promise<any>) {
        if (!this.checkUserLogin(ctx)) {
            return;
        }
        const uid = ctx.session.uid;
        const ids: number[] = ctx.request.body.ids;
        if (!this.checkParams(ctx, ids)) {
            return;
        }
        const res = await this.studentService.deleteStudent(uid, ids);
        this.returnResponse(res, ctx);
    }

    private returnResponse(res: string | number, ctx: koa.Context) {
        if (typeof res === 'string') {
            console.log(res);
            ctx.state = 200;
            ctx.response.body = new AjaxResult(0, res);
        } else if (res === 0) {
            ctx.state = 200;
            ctx.response.body = new AjaxResult(0, 'add student fail');
        } else {
            ctx.state = 200;
            ctx.response.body = new AjaxResult(1, 'success');
        }
    }

    private checkUserLogin(ctx: koa.Context): boolean {
        const uid = ctx.session.uid;
        if (!uid) {
            ctx.state = 200;
            ctx.response.body = new AjaxResult(0, 'Lack of essential property');
            return false;
        }
        return true;
    }

    private checkParams(ctx: koa.Context, ...params: any[]) {
        if (params.some(e => {
            const value = typeof e === 'object' ? Object.values(e) : e;
            return !this.verification.require(value);
        })) {
            ctx.state = 200;
            ctx.response.body = new AjaxResult(0, 'invalid arguments');
            return false;
        }
        return true;
    }

}

