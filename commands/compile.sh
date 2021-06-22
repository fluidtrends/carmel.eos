CONTRACT=$1

if [ -z $CONTRACT ]; then 
    echo "What do you want to compile?"
    exit 1
fi

case "${CONTRACT}" in 
    eos)
        compile_eostoken_contract
        ;;
    tokens)
        compile_contract carmeltokens
        ;;
    system)
        compile_contract carmelsystem
        ;;
    *)
        error "Invalid contract"
        print "Supported: [eos|tokens|system]"
        ;;
esac