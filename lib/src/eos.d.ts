import { Api, JsonRpc } from 'eosjs';
export declare const DEFAULT_URL = "https://eos.greymass.com";
export declare const chain: ({ keys, url }: any) => {
    api: Api;
    rpc: JsonRpc;
    keys: any;
};
export declare const anonChain: () => {
    rpc: JsonRpc;
};
export declare const generateUsername: () => string;
export declare const generateConfigKey: () => string;
export declare const generateDomain: () => string;
export declare const generateElement: () => string;
export declare const get: (c: any, table: string) => Promise<any>;
export declare const signMessage: (msg: string, c: any, key?: string) => any;
export declare const sha256: (message: string) => Promise<any>;
export declare const getTableRows: (c: any, code: string, scope: string, table: string, limit?: number, index?: any) => Promise<any>;
export declare const sendTransaction: (c: any, actor: string, account: string, action: string, data: any, key?: string) => Promise<any>;
export declare const getSystemTableRows: (c: any, table: string) => Promise<any>;
export declare const getId: (c: any, username: string) => Promise<any>;
export declare const sendEOS: (c: any, amount: string, to: string, key?: string) => Promise<any>;
export declare const sendCarmel: (c: any, amount: string, to: string, key?: string) => Promise<any>;
export declare const system: (c: any, action: string, data: any, key?: string) => Promise<any>;
export declare const ticker: (c: any) => Promise<{
    EOS_USDT: {
        price: any;
    };
    CARMEL_EOS: {
        price: any;
    };
    CARMEL_USDT: {
        price: number;
    };
}>;
export declare const getIds: (c: any) => Promise<any>;
export declare const getAssets: (c: any) => Promise<any>;
export declare const getConfig: (c: any) => Promise<any>;
export declare const geTicker: (c: any) => Promise<{
    EOS_USDT: {
        price: any;
    };
    CARMEL_EOS: {
        price: any;
    };
    CARMEL_USDT: {
        price: number;
    };
}>;
export declare const topup: (c: any, amount: string, to: string, type?: string, key?: string) => Promise<any>;
export declare const registerDomain: (c: any, username: string, domain: string, key?: string) => Promise<any>;
export declare const createAccount: (c: any, username: string, publicKey: string, did: string) => Promise<any>;
export declare const getAccountsFromPrivateKey: (data: any) => Promise<{
    publicKey: string;
    accounts: {
        id: string;
        eos: number;
        carmel: number;
    }[];
} | undefined>;
