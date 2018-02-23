import { Tool } from './inject';


@Tool()
export class LogMessage {

    private logFlag = true;

    logMessage(message: any): void {
        if (this.logFlag) {
            console.log(message);
        }
    }

}
