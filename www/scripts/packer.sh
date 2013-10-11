#!/bin/sh

CLIENT=$1
DOCUMENT=$2
CLEF=$3
TEMP=../cache/$CLIENT/temp/

chdir $TEMP

tar -zcvf $DOCUMENT.tar.gz $DOCUMENT 1>&2
if [ "$?" = "0" ]; then
    openssl aes-256-cbc -salt -in $DOCUMENT.tar.gz -pass pass:"$CLEF" -out ../$DOCUMENT.css 1>&2
    if [ "$?" = "0" ]; then
        rm $DOCUMENT
        rm $DOCUMENT.tar.gz
        exit 0
    else
        exit 2
    fi
else
    exit 2
fi


