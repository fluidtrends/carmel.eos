import keys from "../mainnet.keys.json"
import { chain, sendTransaction } from './eos'

import {
  getTableRows,
  getSystemTableRows
} from './eos'

export const sha256 = async (message: string) => {
  // const msgBuffer = new TextEncoder().encode(message)                  
  return require("crypto").createHash("sha256").update(message).digest("hex")

  // const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  // const hashArray = Array.from(new Uint8Array(hashBuffer))
  // const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  // return hashHex;
}

export const eos = () => {
    return chain("https://api.eosn.io", [keys.main.private])
}

export const args = () => {
  process.argv.shift() 
  process.argv.shift()
    
  return process.argv
}

export const get = async (table: string) => getSystemTableRows(eos(), table)

export const getId = async (username: string) => {
  const hash = await sha256(username)
  const result = await getTableRows(eos(), "carmelsystem", "carmelsystem", "identities", 10, {
    lower_bound: hash,
    upper_bound: hash,
    index_position: '2',
    encode_type: 'hex',
    key_type: 'sha256'
  })

  if (!result || result.length < 1) return
   
  return result[0]
}

export const sendEOS = async (amount: string, to: string) => sendTransaction(eos(), keys.main.id, "eosio.token", "transfer", {
    from: keys.main.id, 
    to: "carmelsystem",
    quantity: `${amount} EOS`, 
    memo: `topup:${to}`
})


export const sendCarmel = async (amount: string, to: string) => sendTransaction(eos(), keys.main.id, "carmeltokens", "transfer", {
  from: keys.main.id, 
  to: "carmelsystem", 
  quantity: `${amount} CARMEL`, 
  memo: `topup:${to}`
})

export const system = async (action: string, data: any) => sendTransaction(eos(), keys.main.id, "carmelsystem", action, data)

export const ticker = async () => {
  const EOS_CARMEL = await getTableRows(eos(), "swap.defi", "swap.defi", "pairs", 1, {
    lower_bound: 1408,
    upper_bound: 1408
  })

  const EOS_USDT = await getTableRows(eos(), "swap.defi", "swap.defi", "pairs", 1, {
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

