import * as koa from 'koa';
import { Controller, ResultMapping, Inject } from '../entity/inject';
import { StudentService } from '../service/studentService';
import { AjaxResult } from '../entity/ajaxResult';


@Controller()
@ResultMapping('/student')
export class StudentController {

    @Inject('StudentServoce')
    private studentService: StudentService;

    @ResultMapping('/getGrade')
    public async getGrade(ctx: koa.Context, next: () => Promise<any>) {
        this.checkUserLogin(ctx);
        const res = await this.studentService.getGrade();
        ctx.state = 200;
        ctx.response.body = new AjaxResult(1, 'success', res);
    }

    @ResultMapping('/getStuBygidcid', 'POST')
    public async getStudentByGradeAndClass(ctx: koa.Context, next: () => Promise<any>) {
        this.checkUserLogin(ctx);
        const { gradeId, classId } = ctx.request.body;
        const res = await this.studentService.getStudentByGradeAndClass(gradeId, classId);
        ctx.state = 200;
        ctx.response.body = new AjaxResult(1, 'success', res);
    }

    @ResultMapping('/getStudent')
    public async getStudent(ctx: koa.Context, next: () => Promise<any>) {
        this.checkUserLogin(ctx);
        const page = ctx.query;
        const res = await this.studentService.getStudents(page);
        ctx.state = 200;
        ctx.response.body = new AjaxResult(1, 'success', res);
    }

    public async addStudent(ctx: koa.Context, next: () => Promise<any>) {

    }

    private checkUserLogin(ctx: koa.Context) {
        const uid = ctx.session.uid;
        if (!uid) {
            ctx.state = 200;
            ctx.response.body = new AjaxResult(0, 'Lack of essential property');
        }

    }

}

