#!/bin/sh

CLIENT=$1
DOCUMENT=$2
CLEF=$3
FILENAME="${DOCUMENT%.*}"
EXTENSION="${DOCUMENT##*.}"
TEMP=../cache/$CLIENT/temp/

cd $TEMP

# Extraction du texte du PDF
pdftotext $DOCUMENT

if [ "$?" = '0' ]; then
    tar -zcvf $DOCUMENT-txt.tar.gz $FILENAME.txt 1>&2
    
    if [ "$?" = '0' ]; then
        openssl aes-256-cbc -salt -in $DOCUMENT-txt.tar.gz -pass pass:"$CLEF" -out ../$DOCUMENT-txt.dino 1>&2
        if [ "$?" = '0' ]; then
            exit 0
        else
            exit 2
        fi
    else
        exit 1
    fi
else
    exit 1
fi
