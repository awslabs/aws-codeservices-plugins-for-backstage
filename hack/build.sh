#!/bin/bash

set +ex

file=$1

echo "removing file $file"

read -r -p "Are you sure? [y/N] " response
case "$response" in
    [yY][eE][sS]|[yY])
        rm -rf $file
        ;;
    *)
        exit
        ;;
esac

echo "compile files"
yarn tsc && yarn build

echo "publish the local package"
local-package-publisher -p
