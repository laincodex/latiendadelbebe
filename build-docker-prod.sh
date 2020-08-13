#!/bin/bash
if [ $# -lt 1 ]; then
    echo "Usage: $0 <version>";
    exit 1;
fi

rm -r dist/
yarn deploy
docker build . -t latiendadelbebe:$1
docker save latiendadelbebe:$1 -o latiendadelbebe-$1.tar