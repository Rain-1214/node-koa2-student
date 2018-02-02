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

    /**
     * 加密一个邮箱地址
     * @param data 要加密的字符串
     * @returns {String} 返回将邮箱@前的所有字符除开头两位转换成* 并且将@后'.'之前的也换成*  123456789@xx.xxx => 12*******@xx.xxx
     */
    encryptEmail(data: string): string {
        if (!data.includes('@')) {
            return data;
        }
        const tempArray = data.split('@');
        if (tempArray[0].length < 3) {
            return '兄弟别闹,哪有那么短的邮箱';
        }
        const prefixLength = tempArray[0].length;
        let newPrefix = tempArray[0].slice(0, 2);
        newPrefix = newPrefix.padEnd(prefixLength, '*');

        const suffixLength = tempArray[1].length;
        const suffixArrap = tempArray[1].split('.');
        const newSuffix = `.${suffixArrap[1]}`.padStart(suffixLength, '*');
        return `${newPrefix}@${newSuffix}`;
    }

}

