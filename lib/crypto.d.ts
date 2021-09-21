export declare const generateKey: () => Promise<{
    privateKey: any;
    publicKey: any;
}>;
export declare const generateMnemonic: () => any;
export declare const generateWallet: (mnemonic: string) => any;
export declare const generateWalletKey: (wallet: any, index: number, path?: string) => {
    privateKey: any;
    publicKey: any;
};
export declare const generateSignature: (privateKey: any, password: any) => any;
export declare const doWork: () => void;
export declare const generateIdentity: ({ username, password }: any) => {
    privateKey: any;
    publicKey: any;
    mnemonic: any;
};
export declare const decryptSignature: (data: any) => any;
