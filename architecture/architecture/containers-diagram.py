from diagrams import Diagram
from diagrams.c4 import (
	Person,
    Container,
    Relationship,
    SystemBoundary,
    System,
    Database,
)


PathSaveFile = 'diagrams/containers-diagram'
GraphAttr = {
	'splines': 'spline',
}


with Diagram(filename=PathSaveFile, show=False, direction='TB', graph_attr=GraphAttr):
	User = Person(
		name='User',
		description='interacts with a convenient service interface',
	)

	LargeLanguageModel = System(
		name='LargeLanguageModel',
		description='to correct texts and help with writing',
		external=True,
	)

	with SystemBoundary('ExternalServiceIntegration'):
		GoogleServices = System(
			name='GoogleServices',
			description='integration with Google services',
			external=True,
		)

	with SystemBoundary('Containers'):
		WebApplication = Container(
			name='WebApplication',
			description='a site with a simple interface that is understandable for all users',
			technology='TypeScript[Angular/React]',
		)
		
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

		Cache = Container(
			name='Cache',
			description='storing user sessions and access tokens',
			technology='Redis',
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

		with SystemBoundary('DocServices'):
			DocsEditor = Container(
				name='DocsEditor',
				description='writing documentation, editing and assistance in writing text through communication with LLM and converting text to HTML',
				technology='TypeScript',
			)

			DocsPublish = Container(
				name='DocsPublish',
				description='hosting HTML pages on a subdomain',
				technology='TypeScript',
			)

		with SystemBoundary('DataBases'):
			DataBase1 = Database(
				name='DataBase1',
				description='storage of all profile projects and documentation',
				technology='MongoDB',
			)

			DataBase2 = Database(
				name='DataBase2',
				description='storage of all profiles and comments',
				technology='PostgreSQL',
			)

		with SystemBoundary('Analytics'):
			AnalyticService = Container(
				name='AnalyticService',
				description='collecting useful data and converting it into metrics for Prometheus',
				technology='TypeScript',
			)

			MetricsDataBase = Database(
				name='MetricsDataBase',
				description='collection of structured metrics and their storage',
				technology='Prometheus',
			)

			MetricsVisualization = Container(
				name='MetricsVisualization',
				description='visualization of metrics and creation of statistics based on them',
				technology='Grafana',
			)

		with SystemBoundary('Logs'):
			LogService = Container(
				name='LogService',
				description='Collecting all logs, structuring them and sending them to the Elasticsearch',
				technology='Logstash',
			)

			LogsDataBase = Database(
				name='LogsDataBase',
				description='storage and indexing of all logs and access to them via API',
				technology='Elasticsearch',
			)

			LogsVisualization = Container(
				name='LogsVisualization',
				description='visualization of logs from Elasticsearch, analysis and control of critical situations',
				technology='Kibana',
			)

	### User ###
	User >> Relationship('uses service [HTTP/HTTPS]') << WebApplication

	### WebApplication ###
	WebApplication >> Relationship('') << APIGateway

	### APIGateway ###
	APIGateway >> Relationship('') << MessageBroker
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

	### Analytics ###
	AnalyticService >> Relationship('sends metrics [HTTP/HTTPS]') << MetricsDataBase
	MetricsDataBase >> Relationship('sends metrics [HTTP/HTTPS]') << MetricsVisualization

	### Logs ###
	LogService >> Relationship('sends all logs [HTTP/HTTPS]') << LogsDataBase
	LogsDataBase << Relationship('gets logs [HTTP/HTTPS]') << LogsVisualization

	### DocService ###
	DocsEditor >> Relationship('sending prompt [WebSocket]') << LargeLanguageModel
	DocsEditor >> Relationship('sending documentation in text format [HTTP/HTTPS]') << DataBase1
	DocsEditor >> Relationship('sending HTML [WebSocket]') << DocsPublish

	### AuthService ###
	AuthService >> Relationship('transfers session data [HTTP/HTTPS]') << Cache

	### UsersService ###
	UsersService >> Relationship('sending users data with projects [HTTP/HTTPS]') << DataBase1
	UsersService >> Relationship('sending users data [HTTP/HTTPS]') << DataBase2

	### CommentService ###
	CommentService >> Relationship('sending comments data [HTTP/HTTPS]') << DataBase2

	### IntegrationService ###
	IntegrationService >> Relationship('integrated google and more services [HTTP/HTTPS]') << GoogleServices
