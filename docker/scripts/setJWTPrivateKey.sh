#!/bin/bash
# This script produces a key that is needed for authelia
set -e

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <Destination file>"
    exit 1
fi

DESTINATION_FILE="$1"

# RSA-Schlüssel generieren und in Datei speichern
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 2>/dev/null > "$DESTINATION_FILE"

echo "Private key successfully written to $DESTINATION_FILE"