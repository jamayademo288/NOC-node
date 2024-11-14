
export enum LogSeverityLevel {
    low = 'low',
    medium ='medium',
    high = 'high'
}

export interface LogEntityOptions {
    level: LogSeverityLevel;
    message: string;
    createdAt?: Date;
    origin: string;
}

export class LogEntity {

    public level!: LogSeverityLevel;
    public message!: string;
    public createdAt!: Date;
    public origin!: string;

    constructor( options: LogEntityOptions ) {
        const { message, level, createdAt = new Date(), origin } = options;

        this.level = level;
        this.message = message;
        this.createdAt = createdAt;
        this.origin = origin;
    }

    static fromJson = ( json:string ): LogEntity => {
        const { message, level, createdAt, origin } = JSON.parse(json);

        const log = new LogEntity({
            message: message, 
            level: level,
            createdAt: new Date(createdAt),
            origin: origin

        });

        log.createdAt = new Date(createdAt);
        return log;
    }
}