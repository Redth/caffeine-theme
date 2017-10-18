#!/bin/sh

npm install
bower install

gulp build

rm caffeeine-theme.zip

zip -r caffeeine-theme.zip . \
    -x ".git*" \
    -x "*/.git*" \
    -x "*/node_modules*" \
    -x "*node_modules*" \
    -x "*/assets/vendor*" \
    -x "*assets/vendor*" \
    -x "*package-lock.json*"
 