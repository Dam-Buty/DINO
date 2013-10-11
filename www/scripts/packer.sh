#!/bin/sh

CLIENT=$1
DOCUMENT=$2
CLEF=$3
TEMP=../cache/$CLIENT/temp/

chdir $TEMP

tar -zcvf $DOCUMENT.tar.gz $DOCUMENT
openssl aes-256-cbc -salt -in $DOCUMENT.tar.gz -pass pass:"$CLEF" -out ../$DOCUMENT.css
rm $DOCUMENT
rm $DOCUMENT.tar.gz
