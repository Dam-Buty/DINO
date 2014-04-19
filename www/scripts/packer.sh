#!/bin/sh

CLIENT=$1
DOCUMENT=$2
CLEF=$3
CONVERT=$4
FILENAME="${DOCUMENT%.*}"
EXTENSION="${DOCUMENT##*.}"
TEMP=../cache/$CLIENT/temp/

cd $TEMP

# conversion en PDF si format gere par Libre Office et si client convertit
if [ $CONVERT = "1" ]; then
    if [ $EXTENSION = 'doc' -o $EXTENSION = 'dot' -o $EXTENSION = 'odt' -o $EXTENSION = 'ott' -o $EXTENSION = 'sxw' -o $EXTENSION = 'stw' -o $EXTENSION = 'dotx' -o $EXTENSION = 'docx' -o $EXTENSION = 'odp' -o $EXTENSION = 'otp' -o $EXTENSION = 'sxi' -o $EXTENSION = 'sti' -o $EXTENSION = 'pps' -o $EXTENSION = 'ppt' -o $EXTENSION = 'ppsx' -o $EXTENSION = 'pptx' ]; then
        lowriter --headless --convert-to pdf $DOCUMENT
        
        if [ "$?" = '0' ]; then
            tar -zcvf $DOCUMENT-pdf.tar.gz $FILENAME.pdf 1>&2
            
            if [ "$?" = '0' ]; then
                openssl aes-256-cbc -salt -in $DOCUMENT-pdf.tar.gz -pass pass:"$CLEF" -out ../$DOCUMENT-pdf.dino 1>&2
                if [ "$?" = '0' ]; then
                    rm $FILENAME.pdf
                    if [ "$?" = '0' ]; then
                        rm $DOCUMENT-pdf.tar.gz
                        if [ "$?" != '0' ]; then
                            exit 3
                        fi
                    else
                        exit 3
                    fi
                else
                    exit 2
                fi
            else
                exit 1
            fi
        else
            exit 1
        fi
    fi
fi

tar -zcvf $DOCUMENT.tar.gz $DOCUMENT 1>&2
if [ "$?" = "0" ]; then
    openssl aes-256-cbc -salt -in $DOCUMENT.tar.gz -pass pass:"$CLEF" -out ../$DOCUMENT.dino 1>&2
    if [ "$?" = "0" ]; then
        rm $DOCUMENT
        if [ "$?" = "0" ]; then
            rm $DOCUMENT.tar.gz
            if [ "$?" = "0" ]; then
                exit 0
            else
                exit 3
            fi
        else
            exit 3
        fi
    else
        exit 2
    fi
else
    exit 1
fi


