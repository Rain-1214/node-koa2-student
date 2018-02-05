import { Tool } from './inject';


@Tool()
export class LogMessage {

    private logFlag = true;

    logMessage(message: string): void {
        if (this.logFlag) {
            console.log(message);
        }
    }

}
