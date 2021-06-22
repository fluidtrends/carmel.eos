cleos push action eosio.token create '[ "eosio", "1000000000.0000 EOS"]' -p eosio.token@active
cleos push action carmeltokens create '["carmeltokens", "7000000000.0000 CARMEL"]' -p carmeltokens@active

  # cleos push action carmelsystem addsetting '["carmelsystem", "carmelusd", "1000000"]' -p carmelsystem@active
  # cleos push action carmelsystem addsetting '["carmelsystem", "usdeos", "35000"]' -p carmelsystem@active
  # cleos push action carmelsystem addsetting '["carmelsystem", "creditshare", "10"]' -p carmelsystem@active

cleos push action eosio.token issue '["carmeltokens", "5000.0000 EOS", "initial" ]' -p eosio@active
cleos push action eosio.token issue '["alice", "1000.0000 EOS", "initial" ]' -p eosio@active
cleos push action eosio.token issue '["bob", "1000.0000 EOS", "initial" ]' -p eosio@active
cleos push action eosio.token issue '["chris", "1000.0000 EOS", "initial" ]' -p eosio@active

cleos push action carmeltokens issue '["carmeltokens", "1000000.0000 CARMEL", "initial" ]' -p carmeltokens@active
cleos push action carmeltokens issue '["alice", "100000000.0000 CARMEL", "initial" ]' -p carmeltokens@active
cleos push action carmeltokens issue '["bob", "100000.0000 CARMEL", "initial" ]' -p carmeltokens@active
cleos push action carmeltokens issue '["chris", "100000.0000 CARMEL", "initial" ]' -p carmeltokens@active

# cleos push action carmelsystem createacct '["alice", "alice", "Alice", "1234", "{}"]' -p alice@active
#   cleos push action carmelsystem newuser '["bob", "bob", "Bob", "1234", "{}"]' -p bob@active
  # cleos push action carmelsystem newuser '["chris", "chris", "Chris", "1234", "{}"]' -p chris@active
  # cleos push action carmelsystem newsysadmin '["carmelsystem", "bob"]' -p carmelsystem@active
  # cleos push action carmelsystem newadmin '["bob", "bob", "alice"]' -p bob@active

  # cleos push action carmelsystem newartifact '["bob", "bob", "papanache", "packer", "{}"]' -p bob@active
  # cleos push action carmelsystem newartifact '["bob", "bob", "jayesse", "stack", "{}"]' -p bob@active
  # cleos push action carmelsystem newartifact '["bob", "bob", "traista", "bundle", "{}"]' -p bob@active
  # cleos push action carmelsystem addartifactv '["bob", "bob", "traista", "1.0.0"]' -p bob@active
  # cleos push action carmelsystem addchallenge '["bob", "bob", "traista", "jayesse", "tweaktext", 5, [["markdown", 2]], "{\"title\":\"Change blocks of text on a web page\", \"summary\": \"Locate some blocks of text and change them\"}"]' -p bob@active
  # cleos push action carmelsystem addchvers '["bob", "bob", "traista", "tweaktext", "1.0.0"]' -p bob@active
  # cleos push action carmelsystem addchallenge '["bob", "bob", "traista", "jayesse", "tweakstrings", 5, [["json", 2]], "{\"title\":\"Change calls to action\", \"summary\": \"Identify some calls to action and change the displayed text\"}"]' -p bob@active
  # cleos push action carmelsystem addchvers '["bob", "bob", "traista", "tweakstrings", "1.0.0"]' -p bob@active
  # cleos push action carmelsystem addtemplate '["bob", "bob", "traista", "starter", "{}"]' -p bob@active
  # cleos push action carmelsystem addtemplatev '["bob", "bob", "traista", "starter", "1.0.0"]' -p bob@active

  # cleos push action carmelsystem newplan '[ "carmelsystem", "free", 0, 0, 1]' -p carmelsystem@active
  # cleos push action carmelsystem newplan '[ "carmelsystem", "pro.m", 30, 290000, 1]' -p carmelsystem@active
  # cleos push action carmelsystem newplan '[ "carmelsystem", "pro.y", 365, 2880000, 1]' -p carmelsystem@active
  # cleos push action carmelsystem newplan '[ "carmelsystem", "team.m", 30, 90000, 5]' -p carmelsystem@active
  # cleos push action carmelsystem newplan '[ "carmelsystem", "team.y", 365, 840000, 5]' -p carmelsystem@active
