import { Injectable } from '@nestjs/common';
import { generatePrimeSync, randomBytes } from 'crypto';
import { IKeyPair } from './rsa.interface';

Injectable();
export class RSAService {
  generatePrime() {
    return generatePrimeSync(2048);
  }
  extendedGCD(a, b) {
    console.log(a, b);
    if (b === 0) {
      return [a, 1, 0];
    } else {
      const [d, x, y] = this.extendedGCD(b, a % b);
      return [d, y, x - y * Math.floor(a / b)];
    }
  }
  modExp(b, e, m) {
    let result = 1;
    while (e > 0) {
      if ((e & 1) === 1) {
        result = (result * b) % m;
      }
      b = (b * b) % m;
      e >>= 1;
    }
    return BigInt(result);
  }

  async generateKeyPair() {
    // Generate two large prime numbers
    const p = generatePrimeSync(2048);
    const q = generatePrimeSync(2048);

    // Convert to BigInts
    const bigP = BigInt('0x' + Buffer.from(p).toString('hex'));
    const bigQ = BigInt('0x' + Buffer.from(q).toString('hex'));

    // Calculate n, phi(n), and e
    const n = bigP * bigQ;
    const phiN = (bigP - 1n) * (bigQ - 1n);
    const e = 65537n;

    // Calculate d
    const [d] = this.extendedGCD(e, phiN);

    // Return the public and private keys
    const publicKey = { n: n.toString(), e: e.toString() };
    const privateKey = { n: n.toString(), d: d.toString() };
    return { publicKey, privateKey };
  }

  async encryptRSA(message: string, publicKey: any) {
    const messageBuffer = Buffer.from(message, 'utf8');
    const paddingLength =
      publicKey.n.toString(16).length -
      messageBuffer.length.toString(16).length -
      6;
    const paddingBuffer = randomBytes(paddingLength);
    const messageBufferWithPadding = Buffer.concat([
      Buffer.from('0002', 'hex'),
      paddingBuffer,
      Buffer.from('00', 'hex'),
      messageBuffer,
    ]);
    const m = BigInt('0x' + messageBufferWithPadding.toString('hex'));
    const cipher = this.modExp(m, publicKey.e, publicKey.n);
    const cipherBuffer = Buffer.from(cipher.toString(16), 'hex');
    return cipherBuffer;
  }

  decryptRSA(ciphertext: any, privateKey: any) {
    // Convert the ciphertext to a BigInt
    const c = BigInt('0x' + ciphertext.toString('hex'));

    // Decrypt the message with the private key
    const m = this.modExp(c, privateKey.d, privateKey.n);

    // Convert the message to a buffer
    const mBuffer = Buffer.from(m.toString(16), 'hex');

    // Verify and remove the padding
    if (mBuffer[0] !== 0x00 || mBuffer[1] !== 0x02) {
      throw new Error('Invalid padding');
    }
    let i = 2;
    while (mBuffer[i] !== 0x00) {
      if (++i >= mBuffer.length) {
        throw new Error('Invalid padding');
      }
    }
    const messageBuffer = mBuffer.slice(i + 1);

    // Convert the message buffer to a string
    const message = messageBuffer.toString('utf8');

    return message;
  }
}
