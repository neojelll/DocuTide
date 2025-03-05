FROM openjdk:17-jdk-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    graphviz \
    curl \
    && curl -L -o structurizr-lite.war https://github.com/structurizr/lite/releases/download/v1.34.0/structurizr-lite.war \
    && apt-get purge -y curl \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

COPY structurizr/workspace.dsl .

FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=builder /app/structurizr-lite.war /app/workspace.dsl ./

EXPOSE 8089

ENTRYPOINT ["java", "-jar", "structurizr-lite.war", "workspace.dsl"]
