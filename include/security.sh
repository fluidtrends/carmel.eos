function import_keys() {  
  for key_raw in $(cat keys/dev.private.keys keys/test.private.keys keys/prod.private.keys); do
    if [ -z "$key_raw" ]; then
      continue;
    fi

    key_name="$(cut -d'=' -f1 <<<"$key_raw")"
    key_val="$(cut -d'=' -f2 <<<"$key_raw")"

    if [ -z "$key_val" ]; then
      continue;
    fi

    echo $key_val  | cleos wallet import
  done
}
