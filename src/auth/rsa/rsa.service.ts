import { Injectable } from '@nestjs/common';
import { generatePrimeSync, randomBytes } from 'crypto';
import { IKeyPair } from './rsa.interface';

Injectable();
export class RSAService {
  gcd(a, b) {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }
  modPow(base, exponent, modulus) {
    let result = 1n;
    modulus = BigInt(modulus);
    base = BigInt(base);
    base %= modulus;

    while (exponent > 0) {
      if (exponent % 2 === 1) {
        result = (result * base) % modulus;
      }

      exponent = Math.floor(exponent / 2);
      base = (base * base) % modulus;
    }

    return result;
  }

  multiplicativeInverse(e, phi) {
    let d = 0;
    let x1 = 0;
    let x2 = 1;
    let y1 = 1;
    let tempPhi = phi;

    while (e > 0) {
      const temp1 = Math.floor(tempPhi / e);
      const temp2 = tempPhi - temp1 * e;
      tempPhi = e;
      e = temp2;

      const x = x2 - temp1 * x1;
      const y = d - temp1 * y1;

      x2 = x1;
      x1 = x;
      d = y1;
      y1 = y;
    }

    if (tempPhi === 1) {
      return d + phi;
    }
  }
  isPrime(num) {
    if (num === 2) {
      return true;
    }
    if (num < 2 || num % 2 === 0) {
      return false;
    }
    for (let n = 3; n <= Math.sqrt(num) + 1; n += 2) {
      if (num % n === 0) {
        return false;
      }
    }
    return true;
  }
  generateKeyPair(p, q) {
    if (!(this.isPrime(p) && this.isPrime(q))) {
      throw new Error('Both numbers must be prime.');
    } else if (p === q) {
      throw new Error('p and q cannot be equal');
    }

    // n = pq
    const n = p * q;

    // Phi is the totient of n
    const phi = (p - 1) * (q - 1);

    // Choose an integer e such that e and phi(n) are coprime
    let e = Math.floor(Math.random() * phi) + 1;

    // Use Euclid's Algorithm to verify that e and phi(n) are coprime
    let g = this.gcd(e, phi);
    while (g !== 1) {
      e = Math.floor(Math.random() * phi) + 1;
      g = this.gcd(e, phi);
    }

    // Use Extended Euclid's Algorithm to generate the private key
    const d = this.multiplicativeInverse(e, phi);

    // Return public and private key_pair
    // Public key is (e, n) and private key is (d, n)
    return {
      publicKey: [e, n],
      privateKey: [d, n],
    };
  }
  encrypt(pk, plaintext) {
    // Unpack the key into its components
    const key = pk[0];
    const n = pk[1];

    // Convert each letter in the plaintext to numbers based on the character using a^b mod m
    const cipher = [];
    for (let i = 0; i < plaintext.length; i++) {
      const charCode = plaintext.charCodeAt(i);
      const encryptedCharCode = BigInt(charCode) ** BigInt(key) % BigInt(n);
      cipher.push(encryptedCharCode);
    }

    // Return the array of bytes
    return cipher;
  }
  decrypt(pk, ciphertext) {
    // Unpack the key into its components
    const [key, n] = pk;

    // Generate the plaintext based on the ciphertext and key using a^b mod m
    const plain = [];

    for (const char of ciphertext) {
      const charCode = this.modPow(char, key, n);
      const new2 = Number(charCode);
      plain.push(String.fromCharCode(new2));
    }

    return plain.join('');
  }
}
