echo "seeding with test data ..."

  # cleos --url $ENDPOINT set account permission carmeltokens active --add-code
  # cleos --url $ENDPOINT set account permission carmelsystem active --add-code

  # cleos push action carmelsystem createuser '["chunkymonkey", "EOS7Pzm5B2QSKweYLhHaCQz88w6ecEgMc8hQyh4FbXrDuEQGMv8af", "0:did:carmel:QmNcCAXA2NXkR8QuuJNDPBnSp2h6bQYnHUAEXVEZwdXoj3"]' -p carmelsystem@active

  # cleos --url $ENDPOINT push action carmelsystem addartifactv '["chunkymonkey", "chunkymonkey", "traista", "1.1.1"]' -p chunkymonkey@active
  # cleos --url $ENDPOINT push action carmelsystem addtemplatev '["chunkymonkey", "chunkymonkey", "traista", "starter", "1.1.1"]' -p chunkymonkey@active

  # cleos --url $ENDPOINT push action carmelsystem addsetting '["carmelsystem", "maindatahash", "QmWVWrmpwCt1aczgEHKibLvrG1wbpy2zc3z8SdGGuZNQoQ"]' -p carmelsystem@active

  # cleos --url $ENDPOINT set account permission carmeltokens active --add-code
  # cleos --url $ENDPOINT set account permission carmelsystem active --add-code

  # cleos --url $ENDPOINT push action carmeltokens create '["carmeltokens", "7000000000.0000 CARMEL"]' -p carmeltokens@active
  # cleos --url $ENDPOINT push action carmelsystem addsetting '["carmelsystem", "carmelusd", "1000000"]' -p carmelsystem@active
  # cleos --url $ENDPOINT push action carmelsystem addsetting '["carmelsystem", "usdeos", "35000"]' -p carmelsystem@active
  # cleos --url $ENDPOINT push action carmelsystem addsetting '["carmelsystem", "creditshare", "10"]' -p carmelsystem@active
  # cleos --url $ENDPOINT push action carmeltokens issue '["chunkymonkey", "100000.0000 CARMEL", "initial" ]' -p carmeltokens@active
  # cleos --url $ENDPOINT push action carmelsystem newuser '["chunkymonkey", "chunkymonkey", "Chunky", "1234", "{}"]' -p chunkymonkey@active
  # cleos --url $ENDPOINT push action carmelsystem newuser '["chunkymonkey", "chunkyadmin", "Chunky Admin", "1234", "{}"]' -p chunkymonkey@active
  # cleos --url $ENDPOINT push action carmelsystem newsysadmin '["carmelsystem", "chunkyadmin"]' -p carmelsystem@active
  # cleos --url $ENDPOINT push action carmelsystem newadmin '["chunkymonkey", "chunkyadmin", "chunkymonkey"]' -p chunkymonkey@active

  # cleos --url $ENDPOINT push action carmelsystem newartifact '["chunkymonkey", "chunkymonkey", "papanache", "packer", "{}"]' -p chunkymonkey@active
  # cleos --url $ENDPOINT push action carmelsystem newartifact '["chunkymonkey", "chunkymonkey", "jayesse", "stack", "{}"]' -p chunkymonkey@active
  # cleos --url $ENDPOINT push action carmelsystem newartifact '["chunkymonkey", "chunkymonkey", "traista", "bundle", "{}"]' -p chunkymonkey@active
  # cleos --url $ENDPOINT push action carmelsystem addartifactv '["chunkymonkey", "chunkymonkey", "traista", "1.0.1"]' -p chunkymonkey@active
  # cleos --url $ENDPOINT push action carmelsystem addtemplate '["chunkymonkey", "chunkymonkey", "traista", "starter", "{}"]' -p chunkymonkey@active
  # cleos --url $ENDPOINT push action carmelsystem addtemplatev '["chunkymonkey", "chunkymonkey", "traista", "starter", "1.0.0"]' -p chunkymonkey@active
  # cleos --url $ENDPOINT push action carmelsystem addchallenge '["chunkymonkey", "chunkymonkey", "traista", "jayesse", "tweaktext", 5, [["markdown", 2]], "{\"title\":\"Change blocks of text on a web page\", \"summary\": \"Locate some blocks of text and change them\"}"]' -p chunkymonkey@active
  # cleos --url $ENDPOINT push action carmelsystem addchvers '["chunkymonkey", "chunkymonkey", "traista", "tweaktext", "1.0.1"]' -p chunkymonkey@active

  # cleos --url $ENDPOINT push action carmelsystem newplan '[ "carmelsystem", "free", 0, 0, 1]' -p carmelsystem@active
  # cleos --url $ENDPOINT push action carmelsystem newplan '[ "carmelsystem", "pro.m", 30, 290000, 1]' -p carmelsystem@active
  # cleos --url $ENDPOINT push action carmelsystem newplan '[ "carmelsystem", "pro.y", 365, 2880000, 1]' -p carmelsystem@active
  # cleos --url $ENDPOINT push action carmelsystem newplan '[ "carmelsystem", "team.m", 30, 90000, 5]' -p carmelsystem@active
  # cleos --url $ENDPOINT push action carmelsystem newplan '[ "carmelsystem", "team.y", 365, 840000, 5]' -p carmelsystem@active