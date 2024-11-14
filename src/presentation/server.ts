import { Checkservice } from "../domain/use-cases/checks/check-service";
import { SendEmailLogs } from "../domain/use-cases/email/send-logs";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email.service";

const fileSystemLogRepository = new LogRepositoryImpl(
    new FileSystemDatasource(),
);

const emailService = new EmailService()

export class Server {
   
    public static start() {
        console.log("Starting server...");
        new SendEmailLogs( fileSystemLogRepository, emailService).execute(
            ['amayajoel288@gmail.com']
        )

        
        // emailService.sendEmail({
        //     to: 'amayajoel288@gmail.com',
        //     subject: 'Server status report',
        //     htmlBody: `
        //     <h1>Server status report</h1>
        //     <p>Server is running</p>
        //     <p>Last 10 logs:</p>
        //     `,
        // })

        //mail with attachments
        // emailService.sendEmailWithFileSystemLogs([
        //     'amayajoel288@gmail.com'
        // ])

        // CronService.createJob(
        //     '*/10 * * * * *',
        //     () => {
                
        //         new Checkservice(
        //             fileSystemLogRepository,
        //             () => console.log('Check successful'),
        //             ( error ) => console.log( error ),
        //         ).execute('https://localhost:3000',)
        //     }
        // )
    }
}
