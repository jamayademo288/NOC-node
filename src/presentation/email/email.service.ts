import nodemailer from "nodemailer";
import { envs } from "../../config/plugins/envs.plugin";
import { LogRepository } from "../../domain/repository/log.repository";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

interface SendMailOptions {
    to: string | string[];
    subject: string;
    htmlBody: string;
    attachments?: Attachment[];
}

interface Attachment {
    filename: string;
    path: string;
    //contentType: string;
}

export class EmailService {

    private transporter = nodemailer.createTransport({
        service: envs.MAILER_SERVICE,
        auth: {
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_SECRET_KEY,
        },
    })

    constructor(
        //private readonly logRepository: LogRepository
    ){}

    async sendEmail( options: SendMailOptions ): Promise<boolean> {

        const { to, subject, htmlBody, attachments = [] } = options;
        try {
            const sentInformations = await this.transporter.sendMail({
                to,
                subject,
                html: htmlBody,
                attachments: attachments
            })
            //console.log(sentInformations);
            const log = new LogEntity({
                level: LogSeverityLevel.low,
                message: `Email sent`,
                origin: 'email.service.ts'
            });
            //this.logRepository.saveLog(log)


            console.log('Email sent successfully');

            return true 
        } catch (error) {
            const log = new LogEntity({
                level: LogSeverityLevel.high,
                message: `Email not sent`,
                origin: 'email.service.ts'
            });
            //@@this.logRepository.saveLog(log)
            return false
        }
        
    }

    sendEmailWithFileSystemLogs( to: string | string[], ) {
        const subject = 'logs del servidor';
        const htmlBody =  `
        <h1>Server status report</h1>
        <p>Server is running</p>
        <p>Last 10 logs:</p>
        `
        const attachments: Attachment[] = [
            { filename: 'logs-all.log', path: './logs/logs-all.log' },
            { filename: 'logs-medium.log', path: './logs/logs-medium.log' },
            { filename: 'logs-high.log', path: './logs/logs-high.log' },
        ];

        return this.sendEmail({ to, subject, htmlBody, attachments });
    }


}
