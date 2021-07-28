<h1 class="contract"> crev4b </h1>

Input parameters:

none

### Intent
INTENT. Depicts the current revision of the contract.

### Term
TERM. This Contract expires at the conclusion of code execution. 

<h1 class="contract"> caccount </h1>

Input parameters:

* `username` (the unique id of the user)
* `pub_key` (the public key associated with this user)
* `did` (the Decentralized ID associated with this user account)

### Intent
INTENT. I {{ signer }} want to create a new Carmel User within the Carmel Ecosystem.

### Term
TERM. This Contract expires at the conclusion of code execution. The user will then persist on the chain.

<h1 class="contract"> taccount </h1>

Input parameters:

* `username` (the unique id of the user)
* `pub_key` (the new public key)

### Intent
INTENT. I {{ admin }} want transfer a Carmel User to another authority.

### Term
TERM. This Contract expires at the conclusion of code execution. This action changes the user on the chain.

<h1 class="contract"> uaccount </h1>

Input parameters:

* `username` (the Carmel user to be updated)
* `did` (the new Decentralized ID for this user)
* `sig` (the signature verifying the authority to update the user)

### Intent
INTENT. As a Carmel {{ user }}, I {{ signer }} want to update this {{ user }} with a new DID.

### Term
TERM. This Contract expires at the conclusion of code execution. This action changes the user on the chain.

<h1 class="contract"> setconfig </h1>

Input parameters:

* `key` (the configuration key to update)
* `type` (the type of configuration)
* `value` (the new configuration value)

### Intent
INTENT. I {{ admin }} want update the  Carmel Ecosystem configuration.

### Term
TERM. This Contract expires at the conclusion of code execution. This action changes the Carmel Ecosystem configuration on the chain.

<h1 class="contract"> newdomain </h1>

Input parameters:

* `username` (a unique id representing the owner)
* `domain` (the domain to acquire)
* `sig` (the action signature)

### Intent
INTENT. As a Carmel {{ user }}, I {{ signer }} want to register a Carmel Domain.

### Term
TERM. This Contract expires at the conclusion of code execution. This action changes the inventory on the chain.

<h1 class="contract"> newelement </h1>

Input parameters:

* `username` (a unique id representing the owner)
* `name* `name` (the element name)
* `path` (the path to the element)
* `type` (the type of element)
* `sig` (the action signature)

### Intent
INTENT. As a Carmel {{ user }}, I {{ signer }} want to publish a Carmel Element.

### Term
TERM. This Contract expires at the conclusion of code execution. This action changes the inventory on the chain.