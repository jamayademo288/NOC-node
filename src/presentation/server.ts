import { MongoDatabase } from "../data/mongo";
import { LogSeverityLevel } from "../domain/entities/log.entity";
import { Checkservice } from "../domain/use-cases/checks/check-service";
import { CheckserviceMultiple } from "../domain/use-cases/checks/check-service-multiple";
import { SendEmailLogs } from "../domain/use-cases/email/send-logs";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { MongoLogDatasource } from "../infrastructure/datasources/mongo-log.datasource";
import { PostgresLogDatasource } from "../infrastructure/datasources/postgres-log.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email.service";

// const logRepository = new LogRepositoryImpl(
//     //new FileSystemDatasource(),
//     //new MongoLogDatasource()
//     new PostgresLogDatasource()
// );

const fsLogRepository = new LogRepositoryImpl(
    new FileSystemDatasource(),
    //new MongoLogDatasource()
    //new PostgresLogDatasource()
);

const mongoLogRepository = new LogRepositoryImpl(
    //new FileSystemDatasource(),
    new MongoLogDatasource()
    //new PostgresLogDatasource()
);

const postgresLogRepository = new LogRepositoryImpl(
    //new FileSystemDatasource(),
    //new MongoLogDatasource()
    new PostgresLogDatasource()
);

const emailService = new EmailService()

export class Server {
   
    public static async start() {
        console.log("Starting server...");

        //send email usecase
        // new SendEmailLogs( fileSystemLogRepository, emailService).execute(
        //     ['amayajoel288@gmail.com']
        // )

        
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

        // const logs = await logRepository.getLogs(LogSeverityLevel.high)
        // console.log(logs)

        // CronService.createJob(
        //     '*/10 * * * * *',
        //     () => {
                
        //         new Checkservice(
        //             logRepository,
        //             () => console.log('Check successful'),
        //             ( error ) => console.log( error ),
        //         ).execute('https://google.com',)
        //     }
        // )

        CronService.createJob(
            '*/10 * * * * *',
            () => {
                
                new CheckserviceMultiple(
                    [ fsLogRepository, mongoLogRepository, postgresLogRepository ],
                    () => console.log('Check successful'),
                    ( error ) => console.log( error ),
                ).execute('https://google.com',)
            }
        )
    }
}
