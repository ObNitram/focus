wasm-pack build --target nodejs -d ../electron/main/modules/wasm_lib

rm -rf ../electron/main/modules/wasm_lib/.gitignore

rm -rf ../electron/main/modules/wasm_lib/package.json
