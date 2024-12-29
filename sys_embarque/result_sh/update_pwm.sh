#!/bin/bash

# Paramètres
DEFAULT_PERIOD=10000000  # Période par défaut en nanosecondes
PWM_VALUE=$1
PERIOD_PATH="/sys/class/pwm/pwmchip0/pwm0/period"
DUTY_CYCLE_PATH="/sys/class/pwm/pwmchip0/pwm0/duty_cycle"
ENABLE_PATH="/sys/class/pwm/pwmchip0/pwm0/enable"

# Vérifier si period est correctement configuré
if [ ! -f "$PERIOD_PATH" ] || [ "$(cat $PERIOD_PATH)" -ne "$DEFAULT_PERIOD" ]; then
    echo "$DEFAULT_PERIOD" > "$PERIOD_PATH"
    echo "Période PWM configurée à $DEFAULT_PERIOD ns"
fi

# Calculer le duty_cycle effectif
DUTY_CYCLE=$((PWM_VALUE * DEFAULT_PERIOD / 100))

# Vérifier si le PWM est activé
if [ ! -f "$ENABLE_PATH" ]; then
    echo "Erreur : $ENABLE_PATH n'existe pas."
    exit 3
fi

if [ "$(cat $ENABLE_PATH)" -eq 0 ]; then
    echo 1 > "$ENABLE_PATH"
    echo "PWM activé."
else
    echo "PWM déjà activé."
fi

# Mettre à jour le duty_cycle
if [ -w "$DUTY_CYCLE_PATH" ]; then
    echo "$DUTY_CYCLE" > "$DUTY_CYCLE_PATH"
    echo "Duty cycle mis à jour avec : $DUTY_CYCLE ns"
else
    echo "Erreur : Impossible d'écrire dans $DUTY_CYCLE_PATH. Vérifiez les permissions."
    exit 2
fi

