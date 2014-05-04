#!/bin/sh

CLIENT=$1
DOCUMENT=$2
CLEF=$3
FILENAME="${DOCUMENT%.*}"
EXTENSION="${DOCUMENT##*.}"
TEMP=../cache/$CLIENT/temp/

cd $TEMP

# conversion en PDF via Libre Office
lowriter --headless --convert-to pdf $DOCUMENT

if [ "$?" = '0' ]; then
    tar -zcvf $DOCUMENT-pdf.tar.gz $FILENAME.pdf 1>&2
    
    if [ "$?" = '0' ]; then
        openssl aes-256-cbc -salt -in $DOCUMENT-pdf.tar.gz -pass pass:"$CLEF" -out ../$DOCUMENT-pdf.dino 1>&2
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
