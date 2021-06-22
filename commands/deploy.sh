CONTRACT=$1

if [ -z $CONTRACT ]; then 
    echo "What do you want to deploy?"
    exit 1
fi

case "${CONTRACT}" in 
    tokens)
        deploy_live_contract carmeltokens
        ;;
    system)
        deploy_live_contract carmelsystem
        ;;
    *)
        error "Invalid contract"
        print "Supported: [tokens|system]"
        ;;
esac