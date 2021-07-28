#include "carmelsystem.hpp"

namespace carmel {

    static const char* pszBase58 =
        "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    static const int8_t mapBase58[256] = {
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0,  1,  2,  3,  4,  5,  6,  7,
        8,  -1, -1, -1, -1, -1, -1, -1, 9,  10, 11, 12, 13, 14, 15, 16, -1, 17, 18,
        19, 20, 21, -1, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, -1, -1, -1, -1,
        -1, -1, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, -1, 44, 45, 46, 47, 48,
        49, 50, 51, 52, 53, 54, 55, 56, 57, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1,
    };

    //////////////////////////////////////////////////////////////
    ///////////////////         HELPERS        ///////////////////
    //////////////////////////////////////////////////////////////

    /** @private **/
    uint64_t system::now() {
       return current_time_point().sec_since_epoch();
    }

    /** @private **/
    checksum256 system::hash(string key) {
        return sha256(const_cast<char*>(key.c_str()), key.size());
    }

    /** @private **/
    auto system::get_id(identities_index *ids, const char* username, bool expect_exists) {
        // Let's take a look at the usernames we have on file
        auto usernames_idx = ids->get_index<"usernameidx"_n>();

        // Look up the requested username
        auto username_result = usernames_idx.find(hash(username));

        if (expect_exists) {
            // Make sure it does exist
            check(username_result != usernames_idx.end(), string("The id does not exist"));
        } else {
            // Make sure it does not exist
            check(username_result == usernames_idx.end(), "The username is already taken");
        }

        // Send back the index if we got this far, so we can modify it
        return make_tuple(usernames_idx, username_result);
    }

    /** @private **/
    bool system::decodeBase58(const char* psz, std::vector<unsigned char>& vch) {
        while (*psz && isspace(*psz)) psz++;
        int zeroes = 0;
        int length = 0;
        while (*psz == '1') {
            zeroes++;
            psz++;
        }

        int size = strlen(psz) * 733 / 1000 + 1; 
        std::vector<unsigned char> b256(size);

        static_assert(
            sizeof(mapBase58) / sizeof(mapBase58[0]) == 256,
            "mapBase58.size() should be 256");  
        while (*psz && !isspace(*psz)) {
            int carry = mapBase58[(uint8_t)*psz];
            if (carry == -1)  
                return false;
            int i = 0;
            for (std::vector<unsigned char>::reverse_iterator it = b256.rbegin();
                (carry != 0 || i < length) && (it != b256.rend());
                ++it, ++i) {
                carry += 58 * (*it);
                *it = carry % 256;
                carry /= 256;
            }
            assert(carry == 0);
            length = i;
            psz++;
        }
        while (isspace(*psz)) psz++;
        if (*psz != 0) return false;
        std::vector<unsigned char>::iterator it = b256.begin() + (size - length);
        while (it != b256.end() && *it == 0) it++;
        vch.reserve(zeroes + (b256.end() - it));
        vch.assign(zeroes, 0x00);
        while (it != b256.end()) vch.push_back(*(it++));
        return true;
    }

    /** @private **/
    bool system::decode_base58(const string& str, vector<unsigned char>& vch) {
        return decodeBase58(str.c_str(), vch);
    }
    
    /** @private **/
    eosio::signature system::str_to_sig(const string& sig) {
        const auto pivot = sig.find('_');
        check(pivot != string::npos, "No delimiter in signature");
        const auto prefix_str = sig.substr(0, pivot);
        check(prefix_str == "SIG", "Signature Key has invalid prefix");
        const auto next_pivot = sig.find('_', pivot + 1);
        check(next_pivot != string::npos, "No curve in signature");
        const auto curve = sig.substr(pivot + 1, next_pivot - pivot - 1);
        check(curve == "K1" || curve == "R1", "Incorrect curve");
        const bool k1 = curve == "K1";
        auto data_str = sig.substr(next_pivot + 1);
        check(!data_str.empty(), "Signature has no data");
        vector<unsigned char> vch;
    
        check(decode_base58(data_str, vch), "Decode signature failed");
        check(vch.size() == 69, "Invalid signature");
    
        signature _sig;
        unsigned int type = k1 ? 0 : 1;
        _sig.type = type;
        for (int i = 0; i < sizeof(_sig.data); i++) {
            _sig.data[i] = vch[i];
        }
        
        return _sig;
    }

    /** @private **/
    eosio::public_key system::str_to_pub(const string& pubkey) {
        string pubkey_prefix("EOS");
        auto base58substr = pubkey.substr(pubkey_prefix.length());
        vector<unsigned char> vch;
        check(decode_base58(base58substr, vch), "Decode public key failed");
        check(vch.size() == 37, "Invalid public key");
        
        public_key _pub_key;
        unsigned int type = 0;
         _pub_key.type = type;
        for (int i = 0; i < sizeof(_pub_key.data); i++) {
            _pub_key.data[i] = vch[i];
        }
        
        return _pub_key;
    }

    /** @private **/
    auto system::ensure_auth(string username, string did, string sig) {
          // Ensure the ID exists
        identities_index identities(get_self(), get_self().value);
        auto id = get_id(&identities, username.c_str(), true);

        // Make sure this is the right revision
        uint64_t id_rev = get<1>(id)->rev;
        string digest = string(to_string(id_rev + 1) + CARMEL_SEPARATOR + did);

        // Verify the signature
        eosio::assert_recover_key(hash(digest), str_to_sig(sig), str_to_pub(get<1>(id)->pub_key));

        return id;
    }

    /** @private **/
    system::pairs_table system::get_reserve() {
        #ifndef CARMEL_DEV_ENV
        pairs_index reserves("swap.defi"_n, "swap.defi"_n.value);
        pairs_table reserve = reserves.get(CARMEL_DEFIBOX_ID, "could not retrieve the reserve");
        return reserve;
        #else
        return {
            CARMEL_DEFIBOX_ID, 
            {"carmeltokens"_n, symbol("CARMEL", 4)},
            {"eosio.token"_n, symbol("EOS", 4)},
            asset(4062211041, symbol("CARMEL", 4)),
            asset(363840, symbol("EOS", 4)),
            38383391,
            38383391,
            11164.82805903693952132,
            123,
            16544949560,
            current_time_point()
        };
        #endif
    }

    /** @private **/
    uint64_t system::calculate_swap(uint64_t amount_in) {
        pairs_table reserve = get_reserve();

        uint8_t fee = 30;
        uint64_t reserve_in = reserve.reserve1.amount;      
        uint64_t reserve_out = reserve.reserve0.amount;    

        uint64_t amount_in_with_fee = amount_in * (10000 - fee);  
        uint64_t numerator = amount_in_with_fee * reserve_out;
        uint64_t denominator = (reserve_in * 10000) + amount_in_with_fee;
        uint64_t amount_out = (numerator / denominator);

        return amount_out;
    }

    /** @private **/
    string system::swap_memo(uint64_t amount) {
       return string("swap,") + to_string(amount) + "," + to_string(CARMEL_DEFIBOX_ID);
    }

    /** @private **/
    void system::request_swap(uint64_t in, uint64_t out) {        
        #ifndef CARMEL_DEV_ENV
        action(
          permission_level{get_self(), "active"_n},
          "eosio.token"_n,
          "transfer"_n,
          std::make_tuple(get_self(), "swap.defi"_n, asset(in, symbol("EOS", 4)), swap_memo(out))
        ).send();
        #endif
    }

    /** @private **/
    double system::get_eos_usdt() {
        #ifndef CARMEL_DEV_ENV
        pairs_index reserves("swap.defi"_n, "swap.defi"_n.value);
        pairs_table reserve = reserves.get(EOS_DEFIBOX_ID, "could not retrieve the reserve");
        return reserve.price0_last;
        #else
        return 5.0;
        #endif
    }

    /** @private **/
    double system::get_carmel_eos() {
        pairs_table reserve = get_reserve();
        return reserve.price0_last;
    }

    /** @private **/
    double system::get_carmel_usdt() {
        double eos_usdt = get_eos_usdt();
        double carmel_eos = get_carmel_eos();

        return (carmel_eos / eos_usdt);
    }

    /** @private **/
    string system::getconfig(string key, string type) {
        // Let's take a look at the configs we have on file
        config_index config(get_self(), get_self().value);
        auto config_idx = config.get_index<"keyidx"_n>();
        auto config_result = config_idx.find(hash(string(type + CARMEL_SEPARATOR + key)));

        if(config_result == config_idx.end()) {
            // Make sure it does exist
            return CARMEL_NOT_FOUND;
        } else {
            // Send it back
            return config_result->value;
        }
    }

    /** @private **/
    void system::okusername(string username) {
        check(strlen(username.c_str()) < 32, "The username is longer than 32 characters");
    }

    /** @private **/
    void system::topup(name from, name to, asset quantity, string memo) {
        // Look for the type of topup
        size_t sep_0 = memo.find(CARMEL_SEPARATOR);
        check(sep_0 < 256, "Invalid top up request");
        string kind = memo.substr(0, sep_0); 
        check(strlen(kind.c_str()) > 0, "Invalid top up request");

        if (kind != "carmel") {
            // Only process Carmel topups
            return;
        }

        // Look for the username
        size_t sep_1 = memo.find(CARMEL_SEPARATOR, sep_0 + 1);
        string username = memo.substr(sep_0 + 1, sep_1 - sep_0 - 1); 
        check(strlen(username.c_str()) > 0, "Missing Carmel id");
        identities_index identities(get_self(), get_self().value);
        auto id = get_id(&identities, username.c_str(), true);        

        // Look for details
        string details = "";
        if (sep_1 < memo.size() - 1) {
            details = memo.substr(sep_1 + 1, memo.size() - 1);
        }

        // Set up the new stake
        uint64_t new_stake = quantity.amount;
        uint64_t eos_swapped = 0;

        if (quantity.symbol == EOS_SYMBOL) {
            // Get some tokens first, if needed
            new_stake = calculate_swap(quantity.amount);
            eos_swapped = quantity.amount;
            request_swap(quantity.amount, new_stake);  
        }

        // Looks good, let's update with the new stake
        (get<0>(id)).modify(get<1>(id), get_self(), [&](auto &item) {
            item.balance = get<1>(id)->balance + new_stake;
        });

        // Keep track of this stake
        stakes_index stakes(get_self(), get_self().value);
        auto stakes_idx = stakes.get_index<"usernameidx"_n>();
        stakes.emplace(get_self(), [&](auto &item) {
            item.id = stakes.available_primary_key();
            item.username = username;
            item.details = details;
            item.eos_swapped = eos_swapped;
            item.amount = new_stake;
            item.timestamp = now();
        });
    }

    /** @private **/
    double system::asset_price_usd(string type) {
        string price = getconfig(type, "price");
        if (CARMEL_NOT_FOUND == price) {
            return CARMEL_DEFAULT_ASSET_PRICE_USD;
        } else {
            return stol(price);
        }
    }
    
    /** @private **/
    void system::newasset(string username, string type, string key, bool free, string sig) {
         // Make sure this id exists
        identities_index identities(get_self(), get_self().value);
        auto id = get_id(&identities, username.c_str(), true);

         // Make sure this asset does not exist
        assets_index assets(get_self(), get_self().value);
        auto assets_idx = assets.get_index<"keyidx"_n>();
        auto asset = assets_idx.find(hash(string(type + CARMEL_SEPARATOR + key)));
        check(asset == assets_idx.end(), "This asset is already owned by someone else");
       
        if (!free) {
            // Figure out the CARMEL price
            double asset_price_usdt = asset_price_usd(type);
            double carmel_usdt = get_carmel_usdt();
            uint64_t price = (asset_price_usdt / carmel_usdt) * 10000;

            // Let's check if we have funds for this
            check(get<1>(id)->balance >= price, string("You need " + to_string(price/10000) + " CARMEL"));

            (get<0>(id)).modify(get<1>(id), get_self(), [&](auto &item) {
                // Update the balance
                item.balance = get<1>(id)->balance - price;
            });
        }

         // Let's keep track of this user
        assets.emplace(get_self(), [&](auto &item) {
            item.id = assets.available_primary_key();
            item.key = key;
            item.type = type;
            item.owner = get<1>(id)->username;
        });
    }

    //////////////////////////////////////////////////////////////
    ///////////////////         ACTIONS        ///////////////////
    //////////////////////////////////////////////////////////////

    /** 
      The current contract version.
    **/
    void system::crev4b() {}

    /**
     Update the system configuration

     @param key The configuration key to update
     @param type The type of configuration
     @param value The new configuration value
     */ 
    void system::setconfig(string type, string key, string value) {
        require_auth(_self);
        config_index config(get_self(), get_self().value);
        auto config_idx = config.get_index<"keyidx"_n>();
        auto config_result = config_idx.find(hash(string(type + CARMEL_SEPARATOR + key)));

        if(config_result != config_idx.end()) {
            // Update it
            config_idx.modify(config_result, get_self(), [&](auto &item) {
                item.value = value;
            });
        } else {
            // Add a new one
            config.emplace(get_self(), [&](auto &item) {
                item.id = config.available_primary_key();
                item.key = key;
                item.value = value;
                item.type = type;
            });
        }
    }

    /**
     Update an existing Carmel ID to a new database revision.

     @param username The unique id representing the account 
     @param did The Decentralized Identifier pointing to the new database
     @param sig The signature securing this request
    */
    void system::uaccount(string username, const string& did, const string& sig) {
        // Ensure the ID has access
        auto id = ensure_auth(username, did, sig);
        
        // Looks good, let's update to a new database revision
        (get<0>(id)).modify(get<1>(id), get_self(), [&](auto &item) {
            item.did = did;
            item.rev = item.rev + 1;
        });
    }

    /**
     Transfer an existing Carmel ID.

     @param username The unique id representing the account 
     @param pub_key The new public key
    */
    void system::taccount(string username, string pub_key) {
        require_auth(_self);

        // Make sure this id exists
        identities_index identities(get_self(), get_self().value);
        auto id = get_id(&identities, username.c_str(), true);

        // Looks good, let's update to a new database revision
        (get<0>(id)).modify(get<1>(id), get_self(), [&](auto &item) {
            item.pub_key = pub_key;
        });
    }

    /**
     Create a new Carmel ID.

     @param username A unique id representing the new account 
     @param pub_key The public key securring the account 
     @param did The Decentralized Identifier pointing to the account database
    */
    void system::caccount(string username, string pub_key, string did) {        
        // Validate the username characters
        okusername(username);

        // Take a look at all ids
        identities_index identities(get_self(), get_self().value);

        // Make sure the username is available
        auto id = get_id(&identities, username.c_str(), false);

        // Let's keep track of this user
        identities.emplace(get_self(), [&](auto &item) {
            item.id = identities.available_primary_key();
            item.did = did;
            item.rev = 0;
            item.balance = 0;
            item.pub_key = pub_key;
            item.username = username;
        });
    }

    /**
     Register a new Carmel Domain.

     @param username A unique id representing the owner
     @param domain The domain to acquire
     @param sig The action signature
    */
    void system::newdomain(string username, string domain, string sig) {
        // Make sure we can do this
        ensure_auth(username, domain, sig);

        // Make sure it's a valid domain
        size_t sep_0 = domain.find('.');
        size_t sep_1 = domain.find('.', sep_0 + 1);
        check(sep_0 < 256 && sep_1 >= 256, "Invalid domain request");
        string tld = domain.substr(sep_0 + 1, domain.size() - 1);
        check(tld == "carmel" || tld == "web3", "Invalid domain request");

        // Attempt to acquire it
        newasset(username, "domains", domain, false, sig);
    }

     /**
     Publish a new Carmel Element.

     @param username A unique id representing the owner
     @param name The element name
     @param path The path to the element
     @param type The type of element
     @param sig The action signature
    */
    void system::newelement(string username, string name, string path, string type, string sig) {
        // Make sure we can do this
        ensure_auth(username, name, sig);

        // Attempt to publish it
        newasset(username, "elements/" + type, name + "/" + path, true, sig);
    }

    [[eosio::on_notify("eosio.token::transfer")]]
    void system::topupeos(name from, name to, asset quantity, string memo) {
        if (to != CARMEL_SYS) {
            return;
        }

        check(quantity.symbol == EOS_SYMBOL, "Invalid currency");
        check(quantity.amount >= 20000, "At least 2 EOS required");

        // Attempt to top up
        topup(from, to, quantity, memo);
    }

    [[eosio::on_notify("carmeltokens::transfer")]]
    void system::topupcarmel(name from, name to, asset quantity, string memo) {
        if (to != CARMEL_SYS) {
            return;
        }

        check(quantity.symbol == CARMEL_SYMBOL, "Invalid currency");
        check(quantity.amount >= 1000000, "At least 100 CARMEL required");

        // Attempt to top up
        topup(from, to, quantity, memo);
    }
};