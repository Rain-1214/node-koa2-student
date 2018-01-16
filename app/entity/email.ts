import * as email from 'nodemailer';
import { account } from '../conf/email-config';
import { MailOptions } from 'nodemailer/lib/smtp-transport';
import { Tool } from './inject';

@Tool()
export class Email {

    private emailTransport: email.Transporter;

    constructor() {
        this.creatTransport();
    }

    creatTransport() {
        this.emailTransport = email.createTransport({
            host: 'smtp.163.com',
            secure: true,
            auth: {
                user: account.user, // generated ethereal user
                pass: account.pass  // generated ethereal password
            }
        });
    }

    send(emailAddress: string, subject: string, html: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.emailTransport.sendMail({
                from : 'NodeJS Test <wh_test12138@163.com>',
                to : emailAddress,
                subject : subject,
                html : html
            }, (err: Error, info: any) => {
                if (err) {
                    throw err;
                } else {
                    resolve(info);
                }
            });
        });
    }

}

