#!/bin/bash

DIR=`pwd`"/"
bash $DIR"collectstatic.sh"
appcfg.py update $DIR