#!/bin/sh

CLIENT=$1
DOCUMENT=$2
CLEF=$3

TEMP=../cache/$CLIENT/temp/

cd $TEMP

tar -zcvf $DOCUMENT.tar.gz $DOCUMENT 1>&2
if [ "$?" = "0" ]; then
    openssl aes-256-cbc -salt -in $DOCUMENT.tar.gz -pass pass:"$CLEF" -out ../$DOCUMENT.dino 1>&2
    if [ "$?" = "0" ]; then
        exit 0
    else
        exit 2
    fi
else
    exit 1
fi
