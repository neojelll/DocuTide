FROM openjdk:17-jdk-slim-bullseye AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends graphviz curl

RUN curl -L -o structurizr-lite.war https://github.com/structurizr/lite/releases/download/v2024.12.07/structurizr-lite.war

RUN apt-get purge -y curl && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*

COPY architecture/structurizr/workspace.dsl .

FROM openjdk:17-jdk-slim-bullseye

WORKDIR /app

COPY --from=builder /app/structurizr-lite.war /app/workspace.dsl ./

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "structurizr-lite.war", "workspace.dsl"]
