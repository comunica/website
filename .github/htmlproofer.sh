#!/bin/bash

htmlproofer ./out/ \
    --allow-hash-href true \
    --check-favicon true \
    --check-html true \
    --http-status-ignore "429" \
    --url-ignore "https://query.2020.eswc-conferences.org/,https://2019.eswc-conferences.org/" \
    --disable_external true \
    --extension .html \
    --empty-alt-ignore
