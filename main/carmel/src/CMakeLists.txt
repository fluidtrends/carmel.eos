project(carmel)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)

add_contract( carmel carmel carmel.cpp )
target_include_directories( carmel PUBLIC ${CMAKE_SOURCE_DIR}/../include )
target_ricardian_directory( carmel ${CMAKE_SOURCE_DIR}/../ricardian )