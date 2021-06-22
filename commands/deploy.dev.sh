CONTRACT=$1

if [ -z $CONTRACT ]; then 
    echo "What do you want to deploy?"
    exit 1
fi

case "${CONTRACT}" in 
    eos)
        deploy_dev_eostoken_contract
        ;;
    tokens)
        deploy_dev_contract carmeltokens
        ;;
    system)
        deploy_dev_contract carmelsystem
        ;;
    *)
        error "Invalid contract"
        print "Supported: [eos|tokens|system]"
        ;;
esac