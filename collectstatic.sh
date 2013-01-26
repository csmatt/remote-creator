#!/bin/bash

DIR=`pwd`"/"
YUI=$DIR"../yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar"
JS_FILES=("kocustom.js" "generate.js" "parser.js" "actions.js" "utils.js" "koquery.js" "widget.js" "widgetRow.js" "controller.js" "main.js")
STATIC=$DIR"static/"

cd $STATIC"css/"
java -jar $YUI --type css -o "main-min.css" "main.css"
cd -
cd $STATIC"js/"
rm -f "all.js"
rm -f "all-min.js"

for f in ${JS_FILES[*]}; do
    cat $f >> "all.js";
done
java -jar $YUI --type js -o "all-min.js" "all.js"
cd -
