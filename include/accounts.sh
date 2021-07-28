function create_dev_accounts() {
  echo "creating dev accounts ..."

  cleos create account eosio eosio.token $DEV_PUBLIC
  cleos create account eosio carmelmaster $MASTER_ACTIVE
  cleos create account carmelmaster carmeltokens $TOKENS_ACTIVE
  cleos create account carmelmaster carmelsystem $SYSTEM_ACTIVE
  cleos create account carmelmaster alice $ADMIN_ACTIVE
  cleos create account carmelmaster bob $ADMIN_ACTIVE
  cleos create account carmelmaster chris $ADMIN_ACTIVE

  cleos set account permission carmeltokens active --add-code
  cleos set account permission carmelsystem active --add-code
}