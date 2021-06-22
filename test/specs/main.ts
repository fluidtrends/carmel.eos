import savor, { Context, Completion } from 'savor'
import {
  generateUsername,
  generateDomain,
  sendTransaction,
  signMessage,
  chain, 
  getSystemTableRows
} from '../../src/eos'

const pub_key = "EOS5vDysKHRATDSEcX2ZCWnJavCMJh14LYD8AsxRY3gZ3f5iB9t6c"
const prv_key = "5KeGzwaxKyG5wXqChDi1fi3i13nmqoB9RsBgaa3kM2Ync1YLQ4A"

const TEST_USERNAME="alice"
const SYS_USERNAME="carmelsystem"
const TEST_ACTIVE_PRIVATE_KEY="5JZ4Gn6jCdkA6eWPGEZQiZk9isFwZDVLgRu27ANkQrwgPTeibvo"
const SYS_ACTIVE_PRIVATE_KEY="5J4R8ozDjxYyzGSLhyE6k7SwkQxLaXE8HkahS8jdpEdkyMN9nEF"
const LOCAL_URL = 'http://127.0.0.1:8888'

const NEW_USERNAME = generateUsername()
const NEW_CONFIG_KEY = generateUsername()
const NEW_DOMAIN = `${generateDomain()}.carmel`
const NEW_DOMAIN2 = `${generateDomain()}.carmel`

const CHAIN = chain(LOCAL_URL,[TEST_ACTIVE_PRIVATE_KEY, SYS_ACTIVE_PRIVATE_KEY])

savor.
  add('should create a new ID', (context: Context, done: Completion) => {
    savor.promiseShouldSucceed(sendTransaction(CHAIN, TEST_USERNAME, "carmelsystem", "caccount", {
      username: NEW_USERNAME, pub_key, did: "hello"
    }), done, (result) => {
      context.expect(result.processed.receipt.status).to.equal('executed')
    })
  }).

  add('should not create an ID with a used username', (context: Context, done: Completion) => {
    savor.promiseShouldFail( sendTransaction(CHAIN, TEST_USERNAME, "carmelsystem", "caccount", {
      username: NEW_USERNAME, pub_key, did: "hello2"
    }), done, (error) => {
      context.expect(error.message).to.equal(`assertion failure with message: The username is already taken`)
    })
  }).

  add('should not create an ID with a long username', (context: Context, done: Completion) => {
    savor.promiseShouldFail( sendTransaction(CHAIN, TEST_USERNAME, "carmelsystem", "caccount", {
      username: `${NEW_USERNAME}${NEW_USERNAME}${NEW_USERNAME}`, pub_key, did: "0:hello2"
    }), done, (error) => {
      context.expect(error.message).to.equal(`assertion failure with message: The username is longer than 32 characters`)
    })
  }).

  add('should not update an ID with an invalid signature', (context: Context, done: Completion) => {
    const sig = signMessage('1:hi', prv_key)
    savor.promiseShouldFail( sendTransaction(CHAIN, TEST_USERNAME, "carmelsystem", "uaccount", {
      username: NEW_USERNAME, did: "hello", sig
    }), done, (error) => {
      context.expect(error.message).to.exist
    })
  }).

  add('should not update an account with an invalid revision', (context: Context, done: Completion) => {
    const sig = signMessage('2:hello', prv_key)
    savor.promiseShouldFail( sendTransaction(CHAIN, TEST_USERNAME, "carmelsystem", "uaccount", {
      username: NEW_USERNAME, did: "hello", sig
    }), done, (error) => {
      context.expect(error.message).to.exist
    })
  }).

  add('should update an account', (context: Context, done: Completion) => {
    const sig = signMessage('1:hello2', prv_key)
    savor.promiseShouldSucceed(sendTransaction(CHAIN, TEST_USERNAME, "carmelsystem", "uaccount", {
      username: NEW_USERNAME, did: "hello2", sig
    }), done, (result) => {
      context.expect(result.processed.receipt.status).to.equal('executed')
    })
  }).

  add('should ensure the account did was updated', (context: Context, done: Completion) => {
    savor.promiseShouldSucceed(getSystemTableRows(CHAIN, "identities"), done, (result) => {
      const account = result.find((a: any) => a.username ===  NEW_USERNAME)
      context.expect(account.did).to.equal('hello2')
    })
  }).

  add('should add a setting', (context: Context, done: Completion) => {
    savor.promiseShouldSucceed(sendTransaction(CHAIN, SYS_USERNAME, "carmelsystem", "setconfig", {
      type: "asset_type", key: NEW_CONFIG_KEY, value: "test1234"
    }), done, (result) => {
      context.expect(result.processed.receipt.status).to.equal('executed')
    })
  }).

  add('should ensure as setting was added', (context: Context, done: Completion) => {
    savor.promiseShouldSucceed(getSystemTableRows(CHAIN, "config"), done, (result) => {
      const setting = result.find((a: any) => a.key ===  NEW_CONFIG_KEY)
      context.expect(setting.value).to.equal('test1234')
    })
  }).

  add('should not top up with CARMEL with less than 100', (context: Context, done: Completion) => {
    savor.promiseShouldFail( sendTransaction(CHAIN, TEST_USERNAME, "carmeltokens", "transfer", {
      from: TEST_USERNAME, to: "carmelsystem", quantity: "99.0000 CARMEL", memo: ""
    }), done, (error) => {
      context.expect(error.message).to.equal(`assertion failure with message: At least 100 CARMEL required`)
    })
  }).

  add('should not top up with CARMEL without a valid memo', (context: Context, done: Completion) => {
    savor.promiseShouldFail( sendTransaction(CHAIN, TEST_USERNAME, "carmeltokens", "transfer", {
      from: TEST_USERNAME, to: "carmelsystem", quantity: "100.0000 CARMEL", memo: ""
    }), done, (error) => {
      context.expect(error.message).to.equal(`assertion failure with message: Invalid top up request`)
    })
  }).

  add('should not top up with CARMEL for a non-existent identity', (context: Context, done: Completion) => {
    savor.promiseShouldFail( sendTransaction(CHAIN, TEST_USERNAME, "carmeltokens", "transfer", {
      from: TEST_USERNAME, to: "carmelsystem", quantity: "100.0000 CARMEL", memo: "carmel:b:c"
    }), done, (error) => {
      context.expect(error.message).to.equal(`assertion failure with message: The id does not exist`)
    })
  }).

  add('should top up with CARMEL', (context: Context, done: Completion) => {
    savor.promiseShouldSucceed(sendTransaction(CHAIN, TEST_USERNAME, "carmeltokens", "transfer", {
      from: TEST_USERNAME, to: "carmelsystem", quantity: "2000000.0000 CARMEL", memo: `carmel:${NEW_USERNAME}:some reason`
    }), done, (result) => {
      context.expect(result.processed.receipt.status).to.equal('executed')
    })
  }).

  add('should top up with EOS', (context: Context, done: Completion) => {
    savor.promiseShouldSucceed(sendTransaction(CHAIN, TEST_USERNAME, "eosio.token", "transfer", {
      from: TEST_USERNAME, to: "carmelsystem", quantity: "5.0000 EOS", memo: `carmel:${NEW_USERNAME}`
    }), done, (result) => {
      context.expect(result.processed.receipt.status).to.equal('executed')
    })
  }).

  add('should ensure the stakes were recorded', (context: Context, done: Completion) => {
    savor.promiseShouldSucceed(getSystemTableRows(CHAIN, "stakes"), done, (result) => {
      const stakes = result.filter((a: any) => a.username === NEW_USERNAME)
      context.expect(stakes.length).to.equal(2)
      context.expect(stakes[0].details).to.equal('some reason')
      context.expect(stakes[0].amount).to.equal('20000000000')
      context.expect(stakes[0].eos_swapped).to.equal(0)
      context.expect(stakes[1].details).to.equal('')
      context.expect(stakes[1].amount).to.equal(489499916)
      context.expect(stakes[1].eos_swapped).to.equal(50000)
    })
  }).

  add('should ensure the balance was topped up', (context: Context, done: Completion) => {
    savor.promiseShouldSucceed(getSystemTableRows(CHAIN, "identities"), done, (result) => {
      const account = result.find((a: any) => a.username ===  NEW_USERNAME)
      context.expect(account.balance).to.equal("20489499916")
    })
  }).

  add('should not register an invalid domain', (context: Context, done: Completion) => {
    const sig = signMessage(`1:test`, prv_key)
    savor.promiseShouldFail(sendTransaction(CHAIN, TEST_USERNAME, "carmelsystem", "newdomain", {
      username: NEW_USERNAME, domain: "test", sig
    }), done, (error) => {
      context.expect(error.message).to.exist
    })
  }).

  add('should not register a domain for a non-existent identity', (context: Context, done: Completion) => {
    savor.promiseShouldFail(sendTransaction(CHAIN, TEST_USERNAME, "carmelsystem", "newdomain", {
      username: "test", domain: "test.carmel", sig: "test"
    }), done, (error) => {
      context.expect(error.message).to.exist
    })
  }).

  add('should register an available domain', (context: Context, done: Completion) => {
    const sig = signMessage(`2:${NEW_DOMAIN}`, prv_key)
    savor.promiseShouldSucceed(sendTransaction(CHAIN, TEST_USERNAME, "carmelsystem", "newdomain", {
      username: NEW_USERNAME, domain: NEW_DOMAIN, sig
    }), done, (result) => {
      context.expect(result.processed.receipt.status).to.equal('executed')
    })
  }).

  add('should check that the domain is registered', (context: Context, done: Completion) => {
    savor.promiseShouldSucceed(getSystemTableRows(CHAIN, "assets"), done, (result) => {
      const domain = result.find((a: any) => a.type === 'domains' && a.key === NEW_DOMAIN)
      context.expect(domain.key).to.equal(NEW_DOMAIN)
      context.expect(domain.owner).to.equal(NEW_USERNAME)
    })
  }).

  add('should ensure the funds were withdrawn', (context: Context, done: Completion) => {
    savor.promiseShouldSucceed(getSystemTableRows(CHAIN, "identities"), done, (result) => {
      const account = result.find((a: any) => a.username ===  NEW_USERNAME)
      context.expect(account.balance).to.equal("20489499916")
    })
  }).

  add('should set price for domains', (context: Context, done: Completion) => {
    savor.promiseShouldSucceed(sendTransaction(CHAIN, SYS_USERNAME, "carmelsystem", "setconfig", {
      type: "price", key: "domains", value: "20"
    }), done, (result) => {
      context.expect(result.processed.receipt.status).to.equal('executed')
    })
  }).

  add('should register another available domain', (context: Context, done: Completion) => {
    const sig = signMessage(`2:${NEW_DOMAIN2}`, prv_key)
    savor.promiseShouldSucceed(sendTransaction(CHAIN, TEST_USERNAME, "carmelsystem", "newdomain", {
      username: NEW_USERNAME, domain: NEW_DOMAIN2, sig
    }), done, (result) => {
      context.expect(result.processed.receipt.status).to.equal('executed')
    })
  }).

  add('should check that the domain is registered', (context: Context, done: Completion) => {
    savor.promiseShouldSucceed(getSystemTableRows(CHAIN, "assets"), done, (result) => {
      const domain = result.find((a: any) => a.type === 'domains' && a.key === NEW_DOMAIN2)
      context.expect(domain.key).to.equal(NEW_DOMAIN2)
      context.expect(domain.owner).to.equal(NEW_USERNAME)
    })
  }).

  add('should ensure the funds were withdrawn', (context: Context, done: Completion) => {
    savor.promiseShouldSucceed(getSystemTableRows(CHAIN, "identities"), done, (result) => {
      const account = result.find((a: any) => a.username ===  NEW_USERNAME)
      context.expect(account.balance).to.equal("20489499916")
    })
  }).

  run('[Carmel EOS]')
