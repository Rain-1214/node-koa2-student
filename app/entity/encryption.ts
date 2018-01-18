import * as crypto from 'crypto';
import { Tool } from './inject';

@Tool()
export class Encryption {

    private key = 'nodetest';

    encrypt(data: string) {
        const cipher = crypto.createCipher('aes192', this.key);
        let crypted = cipher.update(data, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }

    decrypt(data: string) {
        const decipher = crypto.createDecipher('aes192', this.key);
        let decrypted = decipher.update(data, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

}

