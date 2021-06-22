/**
    This is the official Carmel EOS smart contract governing
    the Carmel EOS System. 
    
    All actions herein are described in detail 
    in the Ricardian contracts document.

    This contract is subject to the clauses described in the
    Ricardian clauses document.

    @author I. Dan Calinescu (@idancali)
*/

#include <eosio/asset.hpp>
#include <eosio/time.hpp>
#include <eosio/eosio.hpp>
#include <eosio/system.hpp>
#include <eosio/transaction.hpp>
#include <eosio/crypto.hpp>
#include <string>
#include <vector>

#define CARMEL_MINUTE   60
#define CARMEL_HOUR     3600
#define CARMEL_DAY      86400
#define CARMEL_WEEK     604800      // 7 days
#define CARMEL_MONTH    2592000     // 30 days
#define CARMEL_YEAR     31536000    // 365 days
#define CARMEL_FOREVER  31536000000 // 1000 years

#define CARMEL_SYS "carmelsystem"_n
#define CARMEL_TOK "carmeltokens"_n
#define CARMEL_CRE "carmelcredit"_n

#define CARMEL_SYMBOL symbol("CARMEL", 4)
#define EOS_SYMBOL symbol("EOS", 4)
#define EOS_DEFIBOX_ID                  12

#define CARMEL_ACCESS_LEVEL_SYS         900
#define CARMEL_ACCESS_LEVEL_SYSADMIN    800
#define CARMEL_ACCESS_LEVEL_ADMIN       700
#define CARMEL_ACCESS_LEVEL_MOD         500
#define CARMEL_ACCESS_LEVEL_USER        100

#define CARMEL_DEFIBOX_ID               1408
#define CARMEL_DEFAULT_ASSET_PRICE_USD  10
#define CARMEL_NOT_FOUND                "___not_found"
#define CARMEL_SEPARATOR                ':'

using namespace eosio;
using namespace std;

namespace eosiosystem {
   class system_contract;
}

namespace carmel {
   using std::string;
   using std::vector;
   using std::map;
   using std::pair;
   using std::strlen;
   using std::make_pair;
   using eosio::checksum256;
   using eosio::sha256;

   class [[eosio::contract("carmelsystem")]] system : public contract {
      
      public:

        system(name receiver, name code, datastream<const char*> ds )
         : contract(receiver, code, ds) {}

        //////////////////////////////////////////////////////////////
        ///////////////////         ACTIONS        ///////////////////
        //////////////////////////////////////////////////////////////

        [[eosio::action]]
        void crev4b();

        [[eosio::action]]
        void setconfig(string type, string key, string value);

        [[eosio::action]]
        void caccount(string username, string pub_key, string did);

        [[eosio::action]]
        void taccount(string username, string pub_key);

        [[eosio::action]]
        void uaccount(string username, const string& did, const string& sig);

        [[eosio::action]]
        void newdomain(string username, string domain, string sig);

        [[eosio::on_notify("eosio.token::transfer")]]
        void topupeos(name from, name to, asset quantity, string memo);

        [[eosio::on_notify("carmeltokens::transfer")]]
        void topupcarmel(name from, name to, asset quantity, string memo);

      private:

       //////////////////////////////////////////////////////////////
       /////////////////         DATA TYPES         /////////////////
       //////////////////////////////////////////////////////////////

        struct token {
            name contract;
            symbol symbol;

            string to_string() const {
                return contract.to_string() + "-" + symbol.code().to_string();
            };
        };

        struct [[eosio::table]] stakes_table {
            uint64_t id;
            string username;
            string details;
            uint64_t amount;
            uint64_t eos_swapped;
            uint64_t timestamp;
            uint64_t primary_key() const { return id; }
            checksum256 secondary_key() const { return sha256(const_cast<char*>(username.c_str()), username.size()); }
        };

        struct [[eosio::table]] pairs_table {
            uint64_t            id;
            token               token0;
            token               token1;
            asset               reserve0;
            asset               reserve1;
            uint64_t            liquidity_token;
            double              price0_last;
            double              price1_last;
            double              price0_cumulative_last;
            double              price1_cumulative_last;
            time_point_sec      block_time_last;

            uint64_t primary_key() const { return id; }
        };

        struct [[eosio::table]] payments_table {
            uint64_t id;
            uint64_t product_id;
            uint64_t history;
            string username;
            string status;
            uint64_t timestamp;
            uint64_t primary_key() const { return id; }
            checksum256 secondary_key() const { return sha256(const_cast<char*>(username.c_str()), username.size()); }
        }; 

        struct [[eosio::table]] config_table {
            uint64_t id;
            string key;
            string value;
            string type;
            uint64_t primary_key() const { return id; }
            checksum256 secondary_key() const { return sha256(const_cast<char*>(string(type + ":" + key).c_str()), string(type + ":" + key).size()); }
        };         
        
        struct [[eosio::table]] assets_table {
            uint64_t id;
            string key;
            string owner;
            string type;
            uint64_t primary_key() const { return id; }
            checksum256 secondary_key() const { return sha256(const_cast<char*>(string(type + ":" + key).c_str()), string(type + ":" + key).size()); }
        };   

        struct [[eosio::table]] identities_table {
            uint64_t id;
            string username;
            string pub_key;
            string did;
            uint64_t balance;
            uint64_t rev;
            uint64_t primary_key() const { return id; }
            checksum256 secondary_key() const { return sha256(const_cast<char*>(username.c_str()), username.size()); }
        };        

        //////////////////////////////////////////////////////////////
        ///////////////////         TABLES         ///////////////////
        //////////////////////////////////////////////////////////////

        typedef multi_index<"pairs"_n, pairs_table> pairs_index;
        typedef multi_index<"payments"_n, payments_table, indexed_by<"usernameidx"_n, const_mem_fun<payments_table, checksum256, &payments_table::secondary_key>>> payments_index;
        typedef multi_index<"identities"_n, identities_table, indexed_by<"usernameidx"_n, const_mem_fun<identities_table, checksum256, &identities_table::secondary_key>>> identities_index;
        typedef multi_index<"assets"_n, assets_table, indexed_by<"keyidx"_n, const_mem_fun<assets_table, checksum256, &assets_table::secondary_key>>> assets_index;
        typedef multi_index<"stakes"_n, stakes_table, indexed_by<"usernameidx"_n, const_mem_fun<stakes_table, checksum256, &stakes_table::secondary_key>>> stakes_index;
        typedef multi_index<"config"_n, config_table, indexed_by<"keyidx"_n, const_mem_fun<config_table, checksum256, &config_table::secondary_key>>> config_index;

        //////////////////////////////////////////////////////////////
        ///////////////////         HELPERS        ///////////////////
        //////////////////////////////////////////////////////////////

        void newasset(string username, string type, string key, string sig);
        double asset_price_usd(string type);
        void okusername(string username);
        void topup(name from, name to, asset quantity, string memo);
        string getconfig(string type, string key);
        checksum256 hash(string key);
        auto ensure_auth(string username, string did, string sig);
        string swap_memo(uint64_t amount);
        void request_swap(uint64_t in, uint64_t out);
        double get_eos_usdt();
        double get_carmel_usdt();
        double get_carmel_eos();
        uint64_t calculate_swap(uint64_t amount);
        pairs_table get_reserve();
        uint64_t now();
        auto get_id(identities_index *ids, const char* username, bool expect_exists);
        signature str_to_sig(const string& sig);
        bool decodeBase58(const char* psz, std::vector<unsigned char>& vch);
        bool decode_base58(const string& str, vector<unsigned char>& vch);
        public_key str_to_pub(const string& pubkey);
        checksum256 hex_to_sha256(const string& hex_str);
        uint8_t from_hex(char c);
        size_t from_hex(const string& hex_str, char* out_data, size_t out_data_len);

   }; /// carmelsystem contract

} /// namespace carmel
