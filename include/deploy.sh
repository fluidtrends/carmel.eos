function deploy_dev_eostoken_contract() {
  echo "deploying eosio.token contract (${ENV_NAME}) ..."

  cleos set contract eosio.token contracts/eosio.token --abi eosio.token.abi -p eosio.token@active
}  

function deploy_dev_contract() {
  name=$1
  echo "deploying ${name} contract (${ENV_NAME}) ..."

  cleos set contract ${name} contracts/${name} --abi ${name}.abi -p ${name}@active
}

function deploy_live_contract() {
  name=$1
  echo "deploying ${name} contract (${ENV_NAME}) ..."

  cleos --url $ENDPOINT set contract ${name} contracts/${name} --abi ${name}.abi -p ${name}@active
}