function compile_eostoken_contract() {
  print "compiling eosio.token contract (${ENV_NAME}) ..."

  rm -rf contracts/eosio.token/eosio.token.abi
  rm -rf contracts/eosio.token/eosio.token.wasm

  eosio-cpp -I contracts/eosio.token/include -o contracts/eosio.token/eosio.token.wasm contracts/eosio.token/src/eosio.token.cpp --abigen

  print "done"
} 

function compile_contract() {
  name=$1
  print "compiling ${name} contract (${ENV_NAME}) ..."

  rm -rf "contracts/${name}/${name}.abi"
  rm -rf "contracts/${name}/${name}.wasm"

  if [[ "${ENV_NAME}" == "dev" ]]; then
    eosio-cpp -DCARMEL_DEV_ENV -I . -R "contracts/${name}" -o "contracts/${name}/${name}.wasm" "contracts/${name}/${name}.cpp" --abigen
  else 
    eosio-cpp -I . -R "contracts/${name}" -o "contracts/${name}/${name}.wasm" "contracts/${name}/${name}.cpp" --abigen
  fi
  
  print "done"
}

function compile_contract_native() {
  name=$1
  print "compiling ${name} contract natively (${ENV_NAME}) ..."

  rm -rf "contracts/${name}/${name}.abi"
  rm -rf "contracts/${name}/${name}.wasm"

  eosio-cpp -fnative -I . -R "contracts/${name}" -o "contracts/${name}/${name}.wasm" "contracts/${name}/${name}.cpp" --abigen
  print "done"
}