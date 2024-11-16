import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.repository";

interface CheckserviceMultipleUseCase {
    execute(url: string): Promise<boolean>
}

type SuccessCallback = (() => void ) | undefined;
type ErrorCallback = (( error: string ) => void ) | undefined;

export class CheckserviceMultiple implements CheckserviceMultipleUseCase {

    constructor(
        private readonly logRepository: LogRepository[],
        private successCallback: SuccessCallback,
        private errorCallback: ErrorCallback, 
    ){

    }

    private callLogs( log: LogEntity ) {
        this.logRepository.forEach( logRepository => {
            logRepository.saveLog( log );
        });
    }

    public async execute( url: string): Promise<boolean> {

        try {
            const req = await fetch(url);
            if ( !req.ok ) {
                throw new Error(`Failed to check URL: ${url}`);
            }

            const log = new LogEntity( {
                'level': LogSeverityLevel.low,
                'message':`Service ${url} working`, 
                'origin': 'check-service.ts'
            } );
            this.callLogs(log)
            this.successCallback && this.successCallback();
            console.log('Url returned', url)

            return true
        } catch (error) {
            //console.error(`${error}`);
            const message: string = `${ url } is not valid, ${error}`
            const log = new LogEntity( {
                'level': LogSeverityLevel.high,
                'message':`${ url } is not valid, ${error}`, 
                'origin': 'check-service.ts'
            } );
            this.callLogs(log)
            this.errorCallback &&this.errorCallback(message);
            return false
        }
    }
}