FROM openjdk:11-jre-slim

ENV KAFKA_VERSION=3.9.0 \
    SCALA_VERSION=2.13 \
    KAFKA_HOME=/opt/kafka \
    PATH="$PATH:$KAFKA_HOME/bin" \
    KAFKA_BROKER_ID=1 \
    KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 \
    KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:9094 \
    KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092,PLAINTEXT_HOST://0.0.0.0:9094 \
    KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT \
    KAFKA_AUTO_CREATE_TOPICS_ENABLE='true' \
    KAFKA_REPLICATION_FACTOR=1 \
    KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1

RUN apt-get update && apt-get install -y wget && apt-get clean && rm -rf /var/lib/apt/lists/* && \
    wget https://downloads.apache.org/kafka/3.9.0/kafka_2.13-3.9.0.tgz -O /tmp/kafka.tgz && \
    mkdir -p $KAFKA_HOME && tar -xzf /tmp/kafka.tgz --strip-components=1 -C $KAFKA_HOME && rm /tmp/kafka.tgz

COPY server.properties /etc/kafka/server.properties
COPY start-kafka.sh /usr/local/bin/start-kafka.sh
RUN chmod +x /usr/local/bin/start-kafka.sh

EXPOSE 9092 9094
CMD ["/usr/local/bin/start-kafka.sh"]
