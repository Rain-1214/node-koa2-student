import * as crypto from 'crypto';
import { Tool } from './inject';

@Tool()
export class Encryption {

    private key = 'nodetest';

    encrypt(data: string) {
        const cipher = crypto.createCipher('ase192', this.key);
        let crypted = cipher.update(data, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }

    decrypt(data) {
        const decipher = crypto.createDecipher('ase192', this.key);
        let decrypted = decipher.update(data, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

}

