interface CheckserviceUseCase {
    execute(url: string): Promise<boolean>
}

type SuccessCallback = () => void;
type ErrorCallback = ( error: string ) => void

export class Checkservice implements CheckserviceUseCase {

    constructor(
        private successCallback: SuccessCallback,
        private errorCallback: ErrorCallback, 
    ){

    }

    public async execute( url: string): Promise<boolean> {

        try {
            const req = await fetch(url);
            if ( !req.ok ) {
                throw new Error(`Failed to check URL: ${url}`);
            }
            this.successCallback();
            console.log('Url returned', url)
            return true
        } catch (error) {
            console.error(`${error}`);
            this.errorCallback(`${error}`);
            return false
        }
    }
}