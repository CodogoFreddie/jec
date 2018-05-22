#/bin/bash

convert icon@512.png -resize 50% icon@256.png
convert icon@256.png -resize 50% icon@128.png
convert icon@128.png -resize 50% icon@64.png
convert icon@64.png  -resize 50% icon@32.png
