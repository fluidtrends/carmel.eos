const ecc = require('eosjs-ecc')
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('2345abcdefghijklmnopqrstuvwxyz', 12)
import { TextEncoder, TextDecoder } from 'util'
const { Api, JsonRpc, RpcError } = require('eosjs')
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import fetch from 'node-fetch'

export const chain = (url: string, keys: string[]) => {
    const signatureProvider = new JsSignatureProvider(keys)
    const rpc = new JsonRpc(url, { fetch })
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })
    return { api, rpc }    
}

export const generateUsername = () => {
    return nanoid()
} 

export const generateConfigKey = () => {
    return nanoid()
} 

export const generateDomain = () => {
    return nanoid()
}

export const signMessage = (msg: string, privateKey: string) => {
    return ecc.sign(msg, privateKey)
}

export const generateKey = async () =>{
    const privateKey = await ecc.randomKey()
    const publicKey = ecc.privateToPublic(privateKey)

    // var pvt = ecc.PrivateKey('5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3');
    var pub = ecc.PublicKey.fromString('PUB_K1_8VQTVte4jbjxTTHLSVo9WLb1bnzdoQwsLx7fZyQcF23ge42Hs7')
    // var pub2 = ecc.PublicKey.fromString('EOS6GyBhfFYdynrD319fhU5ZwPRAUECTYEBhUSFHNHMMCDpaVPMdY')

    console.log(pub.toString())
    // console.log(pub2.toWif())

    return {
        privateKey, publicKey
    }
}

export const getTableRows = async (c: any, code: string, scope: string, table: string, limit: number = 100, index: any = false) => {
    try {
        const result = await c.rpc.get_table_rows(Object.assign({
            json: true,              
            code,    
            scope,        
            table,      
            limit,              
            reverse: false,           
            show_payer: false          
        }, index && index))

        if (!result.rows) {
            return
        }

        return result.rows
    } catch (e) {
    }
}

export const sendTransaction = async (c: any, actor: string, account: string, action: string, data: any) => {
    const result = await c.api.transact({
        actions: [{
          account,
          name: action,
          authorization: [{
            actor,
            permission: 'active'
          }],
          data
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
    })

    return result
}

export const getSystemTableRows = async (c: any, table: string) => {
    return getTableRows(c, "carmelsystem", "carmelsystem", table)
}