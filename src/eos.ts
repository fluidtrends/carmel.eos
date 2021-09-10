const ecc = require('eosjs-ecc')
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('2345abcdefghijklmnopqrstuvwxyz', 12)
import { TextEncoder, TextDecoder } from 'util'
// const { Api, JsonRpc, RpcError } = require('eosjs')
import { Api, JsonRpc, RpcError } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import fetch from 'node-fetch'

export const DEFAULT_URL = "https://eos.greymass.com"

export const chain = ({ keys, url }: any) => {
    const textDecoder = new globalThis.TextDecoder()
    const signatureProvider = new JsSignatureProvider(Object.keys(keys).map((k: string) => keys[k].private))
    const rpc = new JsonRpc(url, { fetch })
    const api = new Api({ rpc, signatureProvider, textDecoder, textEncoder: new TextEncoder() })
    return { api, rpc, keys }    
}

export const anonChain = () => {
  const rpc = new JsonRpc(DEFAULT_URL, { fetch })
  return { rpc }    
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

export const generateElement = () => {
    return nanoid()
}

export const get = async (c: any, table: string) => getSystemTableRows(c, table)

export const signMessage = (msg: string, c: any, key: string = 'main') => {
    return ecc.sign(msg, c.keys[key].private)
}

export const sha256 = async (message: string) => {
    return require("crypto").createHash("sha256").update(message).digest("hex")
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

export const sendTransaction = async (c: any, actor: string, account: string, action: string, data: any, key: string = 'main') => {
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

export const getId = async (c: any, username: string) => {
    const hash = await sha256(username)
    const result = await getTableRows(c, "carmelsystem", "carmelsystem", "identities", 10, {
      lower_bound: hash,
      upper_bound: hash,
      index_position: '2',
      encode_type: 'hex',
      key_type: 'sha256'
    })
  
    if (!result || result.length < 1) return
     
    return result[0]
  }
  
  export const sendEOS = async (c: any, amount: string, to: string, key: string = 'main') => sendTransaction(c, c.keys[key].id, "eosio.token", "transfer", {
      from: c.keys[key].id, 
      to: "carmelsystem",
      quantity: `${amount} EOS`, 
      memo: `topup:${to}`
  })
  
  export const sendCarmel = async (c: any, amount: string, to: string, key: string = 'main') => sendTransaction(c, c.keys.main.id, "carmeltokens", "transfer", {
    from: c.keys[key].id, 
    to: "carmelsystem", 
    quantity: `${amount} CARMEL`, 
    memo: `topup:${to}`
  })
  
  export const system = async (c: any, action: string, data: any, key: string = 'main') => sendTransaction(c, c.keys[key].id, "carmelsystem", action, data)
  
  export const ticker = async (c: any) => {
    const EOS_CARMEL = await getTableRows(c, "swap.defi", "swap.defi", "pairs", 1, {
      lower_bound: 1408,
      upper_bound: 1408
    })
  
    const EOS_USDT = await getTableRows(c, "swap.defi", "swap.defi", "pairs", 1, {
      lower_bound: 12,
      upper_bound: 12
    })
  
    const CARMEL_USDT = {
      price: parseFloat(EOS_CARMEL[0].price0_last) / parseFloat(EOS_USDT[0].price0_last)
    }
  
    return { 
            EOS_USDT: {
              price: EOS_USDT[0].price0_last
            }, 
            CARMEL_EOS: {
              price: EOS_CARMEL[0].price0_last
            },
            CARMEL_USDT
      }
  }


export const getIds = async (c: any) => get(c, 'identities')

export const getAssets = async (c: any) => get(c, 'assets')

export const getConfig = async (c: any) => get(c, 'config')

export const geTicker = async (c: any) => ticker(c)

export const topup = async (c: any, amount: string, to: string, type: string = 'eos', key: string = 'main') => {  
    if (type.toLowerCase() === 'eos') {
        return sendEOS(c, amount, to, key)
    }

    if (type.toLowerCase() === 'carmel') {
        return sendCarmel(c, amount, to, key)
    }
}

export const registerDomain = async (c: any, username: string, domain: string, key: string = 'main') => {
    const id = await getId(c, username)

    const sig = signMessage(`${parseInt(id.rev) + 1}:${domain}`, c.keys[key].private)
    const result = await system(c, "newdomain", { username, domain, sig }, key)

    return result
}

export const createAccount = async (c: any, username: string, publicKey: string, did: string) => {
  // const id = await getId(c, username)
  // const sig = signMessage(`${parseInt(id.rev) + 1}:${domain}`, c.keys[key].private)
  // const result = await system(c, "newdomain", { username, domain, sig }, key)
  const result = await system (c, "caccount", {
    username, pub_key: publicKey, did
  })
  // sendTransaction(c, c.keys[key].id, "carmelsystem", action, data)


  // sendTransaction(CHAIN, TEST_USERNAME, "carmelsystem", "caccount", {
  //   username: NEW_USERNAME, pub_key, did: "hello"
  // }), done, (result) => {

  return result
}

export const getAccountsFromPrivateKey = async (data: any) => {
  const signatureProvider = new JsSignatureProvider([data.privateKey])
  const getAvailableKeys = await signatureProvider.getAvailableKeys()
  const publicKey = getAvailableKeys[0]

  try {
    const rpc = new JsonRpc(DEFAULT_URL, { fetch })
    let result = await rpc.history_get_key_accounts(publicKey)

    if (!result || !result.account_names) {
        throw new Error('Invalid private key')
    }

    const { account_names } = result

    let balances: any = await Promise.all(account_names.map((a: string) => Promise.all([rpc.get_currency_balance("eosio.token", a), rpc.get_currency_balance("carmeltokens", a)])))
    balances = balances.map((b: any) => b.map((a: any) => a[0]))

    const accounts = account_names.map((id: string, i: number) => {
      const eos = balances[i][0] ? parseFloat(balances[i][0].split()[0]) : -1
      const carmel = balances[i][1] ? parseFloat(balances[i][1].split()[0]) : -1

      return { id, eos, carmel }
    })

    return {
        publicKey,
        accounts
    }
  } catch (e) {
    console.log(e)
  }
}