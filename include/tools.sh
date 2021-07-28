function reset_dev_wallet() {
  echo "resetting the local wallet ..."

  if pgrep keosd; then pkill keosd; fi

  rm -rf ~/eosio-wallet
  rm -rf ~/.eos
  mkdir ~/.eos
  keosd --unlock-timeout=4000000 &

  cleos wallet create --file ~/.eos/wallet.password
}

function stop_dev_server() {
  if pgrep keosd; then 
    pkill keosd
    ok "keosd should now be stopped"
  else 
    error "keosd is not running"
  fi
}

function check_dev_server() {
  if pgrep keosd; then
    ok "keosd is running"
  else
    error "keosd is not running"
  fi

  if [[ -d  ~/eosio-wallet ]]; then 
    ok "wallet exists"
  else
    error "wallet does not exist"
  fi

  if [[ -d  ~/.eos ]]; then 
    ok "cache exists"
  else
    error "cache does not exist"
  fi
}

function start_dev_server() {
  echo "starting the dev server ..."

  if pgrep nodeos; then pkill nodeos; fi
  nodeos \
    -e -p eosio \
    --data-dir ~/.eos/data     \
    --config-dir ~/.eos/config \
    --plugin eosio::producer_plugin      \
    --plugin eosio::chain_plugin         \
    --plugin eosio::chain_api_plugin         \
    --plugin eosio::http_plugin          \
    --plugin eosio::history_api_plugin \
    --plugin eosio::state_history_plugin \
    --contracts-console   \
    --disable-replay-opts \
    --access-control-allow-origin='*' \
    --http-validate-host=false        \
    --verbose-http-errors             \
    --state-history-dir ~/.eos/shpdata \
    --trace-history              \
    --chain-state-history        \
    >> ~/.eos/nodeos.log 2>&1 &
  sleep 1
}