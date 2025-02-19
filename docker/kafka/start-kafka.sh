#!/bin/bash

# Загрузка переменных из .env файла
if [ -f ../../.env ]; then
    export $(grep -v '^#' ../../.env | xargs)
fi

# Запуск Kafka
/opt/kafka/bin/kafka-server-start.sh /etc/kafka/server.properties &

# Ожидание завершения процессов
wait
