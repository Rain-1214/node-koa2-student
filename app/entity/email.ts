import * as email from 'nodemailer';
import { account } from '../conf/email-config';
import { MailOptions } from 'nodemailer/lib/smtp-transport';
import { Tool } from './inject';

@Tool()
export class Email {

    private emailTransport: email.Transporter;
    private mailOption: MailOptions = {};

    constructor() {
        this.creatTransport();
    }

    creatTransport() {
        this.emailTransport = email.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: account.user, // generated ethereal user
                pass: account.pass  // generated ethereal password
            }
        });
    }

    send(emailAddress: string) {
        // this.mailOption.from = '"Hellow 👻" <wh_test12138@163.com>';
        // this.mailOption.to = emailAddress;
        // this.mailOption.subject = 'Hellow';
        // this.mailOption.html = '<h1>Hellow</h1>';
        this.emailTransport.sendMail({
            from : '"Hellow 👻" <wh_test12138@163.com>',
            to : emailAddress,
            subject : 'Hellow',
            html : '<h1>Hellow</h1>'
        }, (err: Error, info: any) => {
            if (err) {
                throw err;
            }
        });
    }

}

