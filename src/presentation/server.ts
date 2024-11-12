import { Checkservice } from "../domain/use-cases/checks/check-service";
import { CronService } from "./cron/cron-service";


export class Server {
   
    public static start() {
        console.log("Starting server...");

        CronService.createJob(
            '0 * * * * *',
            () => {
                new Checkservice(
                    () => console.log('Check successful'),
                    ( error ) => console.log( error ),
                ).execute('http://google.com',)
            }
        )
    }
}
