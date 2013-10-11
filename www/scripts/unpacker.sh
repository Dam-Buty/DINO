#!/bin/sh

CLIENT=$1
DOCUMENT=$2
CLEF=$3
CACHE=../cache/$CLIENT/
TEMP=temp/

chdir $CACHE

openssl aes-256-cbc -d -in $DOCUMENT.css -pass pass:"$CLEF" -out $TEMP$DOCUMENT.tar.gz
chdir $TEMP
tar -zxvf $DOCUMENT.tar.gz
rm $DOCUMENT.tar.gz
cat $DOCUMENT
rm $DOCUMENT
