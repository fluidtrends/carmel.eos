#!/usr/bin/env bash
set -e

ENV=dev

print () {
    echo "[carmel.eos ${ENV}] ${1}"
}

ok () {
    echo "[carmel.eos ${ENV}] ✔ ${1}"
}

run () {
    echo "➔ ${1}"
}

error () {
    echo "[carmel.eos ${ENV}] ✘ ${1}"
}

usage() { 
      echo "Usage: [-e dev|test|prod] [status|start|stop|compile|deploy]"
      echo " -h                     Display this help message."
      echo " -e [dev|test|prod]     Set the environment."
      echo " status                 Check the environment."
      echo " start                  Start the environment."
      echo " stop                   Stop the environment."
      echo " compile                Compile one or more contracts."
      echo " deploy                 Deploy one or more contracts."
      echo " test                   Test one or more contracts."
      exit 1
}

while getopts ":h:e:" o; do
    case "${o}" in
        e)
            if ! ([[ "${OPTARG}" == "dev" ]] || [[ "${OPTARG}" == "test" ]] || [[ "${OPTARG}" == "prod" ]]); then 
              echo "Invalid environment"; usage
            fi
            ENV="${OPTARG}"
            ;;
        h)
            usage
            ;;
        *)
            echo "Invalid environment"; usage
            ;;
    esac
done

shift $((OPTIND-1))
CMD=$1

case "${CMD}" in 
    status)
        SCRIPT="./commands/status.sh"
        ;;
    start)
        SCRIPT="./commands/start.sh"
        ;;
    seed)
        SCRIPT="./commands/seed.dev.sh"
        if [[ "${ENV}" == "test" ]]; then
            SCRIPT="./commands/seed.test.sh"
        elif [[ ! "${ENV}" == "dev" ]]; then
            echo "Can only seed on dev or test"   
            usage
        fi        
        ;;
    stop)
        SCRIPT="./commands/stop.sh"
        ;;
    test)
        SCRIPT="./commands/test.sh"
        ;;
    compile)
        SCRIPT="./commands/compile.sh"
        ;;
    deploy)
        SCRIPT="./commands/deploy.sh"
        if [[ "${ENV}" == "dev" ]]; then
            SCRIPT="./commands/deploy.dev.sh"
        fi
        ;;
    *)
        echo "Invalid command"; usage   
        ;;
esac

# shift $((OPTIND-1))
shift

echo "************************************** carmel.eos **************************************"
echo
run "Running [${CMD}] command"
echo

__="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
cd "$(dirname $__)"

ID="carmel"

. "config/${ENV}.config"
. "keys/${ENV}.public.keys"

. "./include/tools.sh" --source-only
. "./include/security.sh" --source-only
. "./include/accounts.sh" --source-only
. "./include/compile.sh" --source-only
. "./include/deploy.sh" --source-only
. "./include/assert.sh" --source-only

. "$SCRIPT"

echo
echo "************************************** carmel.eos **************************************"

