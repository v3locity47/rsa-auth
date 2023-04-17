export interface IKey {
  n: number;
  e?: any;
  d?: any;
}

export interface IKeyPair {
  publicKey: IKey;
  privateKey: IKey;
}
