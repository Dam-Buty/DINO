#!/bin/bash

CLIENT=$1
DOCUMENT=$2
CLEF=$3
CACHE=../cache/$CLIENT/
TEMP=temp/

cd $CACHE

openssl aes-256-cbc -d -in $DOCUMENT.css -pass pass:"$CLEF" -out $TEMP$DOCUMENT.tar.gz
if [ "$?" = "0" ]; then
    cd $TEMP
    tar -O -zxvf $DOCUMENT.tar.gz
    if [ "$?" = "0" ]; then
        rm $DOCUMENT.tar.gz
        if [ "$?" = "0" ]; then
            exit 0
        else
            exit 3
        fi
    else
        exit 2
    fi
else
    exit 1
fi

