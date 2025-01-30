from diagrams import Diagram
from diagrams.c4 import (
    Container,
    Relationship,
    SystemBoundary,
)


PathSaveFile = 'diagrams/messagebroker-relationships-diagram'
GraphAttr = {
	'splines': 'spline',
}


with Diagram(filename=PathSaveFile, show=False, direction='TB', graph_attr=GraphAttr):
	with SystemBoundary('Containers'):
		APIGateway = Container(
			name='API Gateway',
			description='a central entry point for processing all requests and routing them to the appropriate services',
			technology='TypeScript',
		)

		MessageBroker = Container(
			name='MessageBroker',
			description='provides asynchronous message passing between microservices for event processing',
			technology='Kafka',
		)

		AuthService = Container(
			name='AuthService',
			description='sends events to Kafka when a user registers and logs in',
			technology='TypeScript',
		)

		UsersService = Container(
			name='UsersSerice',
			description='subscribes to events from Kafka to update users',
			technology='TypeScript',
		)

		ProjectService = Container(
			name='ProjectService',
			description='creating and setting up projects in the user profile',
			technology='TypeScript',
		)

		CommentService = Container(
			name='CommentService',
			description='creating, editing and sending comments to the project',
			technology='TypeScript',
		)

		PublicProjectFeedService = Container(
			name='PublicProjectFeedService',
			description='collection, storage and provision of information about all public projects available to users',
			technology='TypeScript',
		)

		NotificationService = Container(
			name='NotificationService',
			description='sending notifications to users about various events occurring in the system, such as registration, profile updates, comments and other actions',
			technology='TypeScript',
		)

		IntegrationService = Container(
			name='IntegrationService',
			description='management of all integrations with external services',
			technology='TypeScript',
		)

		DocsEditor = Container(
			name='DocsEditor',
			description='writing documentation, editing and assistance in writing text through communication with LLM and converting text to HTML',
			technology='TypeScript',
		)

		AnalyticService = Container(
			name='AnalyticService',
			description='collecting useful data and converting it into metrics for Prometheus',
			technology='TypeScript',
		)
			
		LogService = Container(
			name='LogService',
			description='Collecting all logs, structuring them and sending them to the Elasticsearch',
			technology='Logstash',
		)

	### APIGateway ###
	APIGateway >> Relationship('end data [HTTP/HTTPS]') << MessageBroker
	APIGateway >> Relationship('send data [WebSocket]') >> DocsEditor

	### MessageBroker ###
	MessageBroker >> Relationship('sends data for metrics [HTTP/HTTPS]') >> AnalyticService
	MessageBroker >> Relationship('sends all logs [HTTP/HTTPS]') >> LogService
	MessageBroker >> Relationship('sends events (user.registered, user.logged.in) to Kafka [HTTP/HTTPS]') << AuthService
	MessageBroker >> Relationship('sends events (project.created, project.updated, project.deleted) to Kafka [HTTP/HTTPS]') << ProjectService
	MessageBroker >> Relationship('subscribes to events from Kafka to update users and auth topics [HTTP/HTTPS]') << UsersService
	MessageBroker >> Relationship('subscribes to events related to changes in projects, such as project.created, project.updated, project.deleted [HTTP/HTTPS]') << PublicProjectFeedService
	MessageBroker >> Relationship('subscription to all topics [HTTP/HTTPS]') << NotificationService
	MessageBroker >> Relationship('get profile and project info and sends events (docs.create ...)') << DocsEditor
	MessageBroker >> Relationship('subscribe for need topic and create new topics [HTTP/HTTPS]') << IntegrationService
	MessageBroker >> Relationship('created comments topics [HTTP/HTTPS]') << CommentService
