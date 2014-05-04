#!/bin/sh

CLIENT=$1
DOCUMENT=$2
CLEF=$3
FILENAME="${DOCUMENT%.*}"
EXTENSION="${DOCUMENT##*.}"
TEMP=../cache/$CLIENT/temp/

cd $TEMP

rm $DOCUMENT
rm $DOCUMENT.tar.gz
rm $FILENAME.pdf
rm $DOCUMENT-pdf.tar.gz
rm $FILENAME.txt
rm $DOCUMENT-txt.tar.gz

exit 0
