workspace "DocuTide" "Service for creating, editing and publishing documentation" {

    model {
        user = person "User" "Interacts with a convenient service interface"

        # External systems
        largeLanguageModel = softwareSystem "LargeLanguageModel" "Corrects texts and assists with writing" {
            tags "External"
        }
        googleServices = softwareSystem "GoogleServices" "Integration with Google services" {
            tags "External"
        }

        docuTide = softwareSystem "DocuTide" "Service for creating, editing and publishing documentation" {
            webApplication = container "WebApplication" "Simple user interface" "TypeScript[Angular/React]"
            apiGateway = container "APIGateway" "Central entry point for requests" "TypeScript"
            messageBroker = container "MessageBroker" "Asynchronous message passing" "Kafka"
            cache = container "Cache" "Stores user sessions and tokens" "Redis"

            authService = container "AuthService" "Handles registration and login events" "TypeScript"
            usersService = container "UsersService" "Manages user updates" "TypeScript"
            projectService = container "ProjectService" "Manages projects" "TypeScript"
            commentService = container "CommentService" "Handles project comments" "TypeScript"
            publicProjectFeedService = container "PublicProjectFeedService" "Manages public project feed" "TypeScript"
            notificationService = container "NotificationService" "Sends notifications" "TypeScript"
            integrationService = container "IntegrationService" "Manages external integrations" "TypeScript"

            docServices = container "DocServices" "Documentation management" {
                docsEditor = container "DocsEditor" "Edits and assists with documentation" "TypeScript"
                docsPublish = container "DocsPublish" "Hosts HTML pages" "TypeScript"
            }

            dataBase1 = container "DataBase1" "Stores projects and documentation" "MongoDB" {
                tags "Database"
            }
            dataBase2 = container "DataBase2" "Stores profiles and comments" "PostgreSQL" {
                tags "Database"
            }

            analytics = container "Analytics" "Metrics and visualization" {
                analyticService = container "AnalyticService" "Collects metrics" "TypeScript"
                metricsDataBase = container "MetricsDataBase" "Stores metrics" "Prometheus" {
                    tags "Database"
                }
                metricsVisualization = container "MetricsVisualization" "Visualizes metrics" "Grafana"
            }

            logs = container "Logs" "Log management" {
                logService = container "LogService" "Collects and structures logs" "Logstash"
                logsDataBase = container "LogsDataBase" "Stores and indexes logs" "Elasticsearch" {
                    tags "Database"
                }
                logsVisualization = container "LogsVisualization" "Visualizes logs" "Kibana"
            }
        }

        user -> webApplication "Uses service [HTTP/HTTPS]"
        webApplication -> apiGateway ""
        apiGateway -> messageBroker ""
        apiGateway -> docsEditor "Sends data [WebSocket]"

        messageBroker -> analyticService "Sends data for metrics [HTTP/HTTPS]"
        messageBroker -> logService "Sends all logs [HTTP/HTTPS]"
        authService -> messageBroker "Sends events (user.registered, user.logged.in) [HTTP/HTTPS]"
        projectService -> messageBroker "Sends events (project.created, project.updated, project.deleted) [HTTP/HTTPS]"
        usersService -> messageBroker "Subscribes to events [HTTP/HTTPS]"
        publicProjectFeedService -> messageBroker "Subscribes to project events [HTTP/HTTPS]"
        notificationService -> messageBroker "Subscribes to all topics [HTTP/HTTPS]"
        integrationService -> messageBroker "Subscribes and creates topics [HTTP/HTTPS]"
        commentService -> messageBroker "Creates comment topics [HTTP/HTTPS]"
        docsEditor -> messageBroker "Gets profile/project info [HTTP/HTTPS]"

        docsEditor -> largeLanguageModel "Sends prompt [WebSocket]"
        docsEditor -> dataBase1 "Sends documentation [HTTP/HTTPS]"
        docsEditor -> docsPublish "Sends HTML [WebSocket]"

        authService -> cache "Transfers session data [HTTP/HTTPS]"
        usersService -> dataBase1 "Sends user/project data [HTTP/HTTPS]"
        usersService -> dataBase2 "Sends user data [HTTP/HTTPS]"
        commentService -> dataBase2 "Sends comments [HTTP/HTTPS]"
        integrationService -> googleServices "Integrates [HTTP/HTTPS]"

        analyticService -> metricsDataBase "Sends metrics [HTTP/HTTPS]"
        metricsDataBase -> metricsVisualization "Sends metrics [HTTP/HTTPS]"
        logService -> logsDataBase "Sends logs [HTTP/HTTPS]"
        logsDataBase -> logsVisualization "Gets logs [HTTP/HTTPS]"
    }

    views {
        systemContext docuTide "SystemContext" {
            include *
            autoLayout
        }

        container docuTide "Containers" {
            include *
            autoLayout
        }

        container docuTide "DocsEditorRelationships" {
            include docsEditor messageBroker apiGateway usersService projectService largeLanguageModel dataBase1 docsPublish
            autoLayout
        }

        container docuTide "MessageBrokerRelationships" {
            include messageBroker apiGateway authService usersService projectService commentService publicProjectFeedService notificationService integrationService docsEditor analyticService logService
            autoLayout
        }

        container docuTide "MVP" {
            include webApplication apiGateway messageBroker usersService projectService docsEditor dataBase1 dataBase2
            autoLayout
        }

        styles {
            element "External" {
                background #999999
            }
            element "Database" {
                shape Cylinder
            }
        }
    }
}
