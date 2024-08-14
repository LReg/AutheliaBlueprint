#!/bin/bash
# Fehlerbehandlung: Beendet das Skript, wenn ein Befehl fehlschlägt
set -e

# Überprüfen, ob genügend Argumente übergeben wurden
if [ "$#" -ne 2 ]; then
    echo "Verwendung: $0 <ENV_FILE> <CONFIG_FILE>"
    exit 1
fi

# Dateien
ENV_FILE="$1"
CONFIG_FILE="$2"

# Datei durchgehen und Variablen ersetzen
while IFS= read -r line; do
    # Nur Linien mit Variablenzuweisungen verarbeiten (ignoriert Leerzeichen und Kommentare)
    if [[ "$line" =~ ^[A-Z_]+=[^\"]+ ]]; then
        VAR_NAME=$(echo "$line" | cut -d'=' -f1)
        VAR_VALUE=$(echo "$line" | cut -d'=' -f2-)

        # Ersetzen der Variablen im Konfigurationsfile
        # Escape das $-Zeichen für die Verwendung in sed
        sed -i "s|\$$VAR_NAME|$VAR_VALUE|g" "$CONFIG_FILE"
    fi
done < "$ENV_FILE"

echo "Konfigurationsdatei $CONFIG_FILE wurde erfolgreich aktualisiert."
