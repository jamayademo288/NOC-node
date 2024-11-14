import { EmailService } from "../../../presentation/email/email.service";
import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.repository";


interface SendLogEmailUseCase {
    execute: ( to: string | string[] ) => Promise<boolean>;
}

export class SendEmailLogs implements SendLogEmailUseCase {

    constructor(
        private readonly logRepository: LogRepository,
        private readonly emailService: EmailService,
    ){}

    async execute( to: string | string[]) {

        try {
            const sent = await this.emailService.sendEmailWithFileSystemLogs( to );
            if ( !sent ) {
                throw new Error('Failed to send email logs');
            }

            const log = new LogEntity({
                message: `Success to send email logs`,
                level: LogSeverityLevel.low,
                origin: 'send-logs.ts'
            })
            this.logRepository.saveLog( log )

            return true;
        } catch (error) {
            const log = new LogEntity({
                message: `Failed to send email logs: ${error}`,
                level: LogSeverityLevel.high,
                origin: 'send-logs.ts'
            })
            this.logRepository.saveLog( log )
            return false;
        }

        
    }
}