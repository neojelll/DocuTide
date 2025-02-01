from diagrams import Diagram
from diagrams.c4 import (
	Person,
    Container,
    Relationship,
    SystemBoundary,
    Database,
)


PathSaveFile = 'diagrams/mvp-diagram'
GraphAttr = {
	'splines': 'spline',
}


with Diagram(filename=PathSaveFile, show=False, direction='TB', graph_attr=GraphAttr):
	User = Person(
		name='User',
		description='interacts with a convenient service interface',
	)

	with SystemBoundary('Containers'):
		WebApplication = Container(
			name='Web Application',
			description='a site with a simple interface that is understandable for all users',
			technology='TypeScript[Angular]',
		)
		
		APIGateway = Container(
			name='API Gateway',
			description='a central entry point for processing all requests and routing them to the appropriate services',
			technology='TypeScript[Nest.js]',
		)

		MessageBroker = Container(
			name='Message Broker',
			description='provides asynchronous message passing between microservices for event processing',
			technology='Kafka',
		)

		UsersService = Container(
			name='Users Serice',
			description='subscribes to events from Kafka to update users',
			technology='TypeScript[Nest.js]',
		)

		ProjectsService = Container(
			name='Projects Service',
			description='creating and setting up projects in the user profile',
			technology='TypeScript[Nest.js]',
		)

		DocsEditor = Container(
			name='Docs Editor',
			description='writing documentation, editing and assistance in writing text through communication with LLM and converting text to HTML',
			technology='TypeScript[Nest.js]',
		)

		with SystemBoundary('DataBases'):
			Database1 = Database(
				name='Database1',
				description='storage of all profile projects and documentation',
				technology='MongoDB',
			)

			Database2 = Database(
				name='Database2',
				description='storage of all profiles and comments',
				technology='PostgreSQL',
			)

	### User ###
	User >> Relationship('uses service [HTTP/HTTPS]') << WebApplication

	### WebApplication ###
	WebApplication >> Relationship('') << APIGateway

	### APIGateway ###
	APIGateway >> Relationship('') << MessageBroker
	APIGateway >> Relationship('send data [WebSocket]') >> DocsEditor

	### MessageBroker ###
	MessageBroker >> Relationship('sends events (project.created, project.updated, project.deleted) to Kafka [HTTP/HTTPS]') << ProjectsService
	MessageBroker >> Relationship('subscribes to events from Kafka to update users and auth topics [HTTP/HTTPS]') << UsersService
	MessageBroker >> Relationship('get profile and project info and sends events (docs.create ...)') << DocsEditor

	### DocService ###
	DocsEditor >> Relationship('sending documentation in text format [HTTP/HTTPS]') << Database1

	### UsersService ###
	UsersService >> Relationship('sending users data with projects [HTTP/HTTPS]') << Database1
	UsersService >> Relationship('sending users data [HTTP/HTTPS]') << Database2
