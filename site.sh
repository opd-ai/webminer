#! /bin/bash
WSS_URL=$(cat tunnel_url.txt | sed 's|^http://||' | sed 's|/$||' | sed 's|^https://|wss://|')
node generate-site.js \
    --pool="$WSS_URL" \
    --wallet="43H3Uqnc9rfEsJjUXZYmam45MbtWmREFSANAWY5hijY4aht8cqYaT2BCNhfBhua5XwNdx9Tb6BEdt4tjUHJDwNW5H7mTiwe" \
    --throttle="0.25"
git add -v .
git commit -m "Regenerate site with updated pool URL"
git push origin main