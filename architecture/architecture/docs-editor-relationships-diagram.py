from diagrams import Diagram
from diagrams.c4 import (
    Container,
    Relationship,
    SystemBoundary,
    System,
    Database,
)


PathSaveFile = 'diagrams/docs-editor-relationships-diagram'
GraphAttr = {
	'splines': 'spline',
}


with Diagram(filename=PathSaveFile, show=False, direction='TB', graph_attr=GraphAttr):
	LargeLanguageModel = System(
		name='LargeLanguageModel',
		description='to correct texts and help with writing',
		external=True,
	)

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

	### APIGateway ###
	APIGateway >> Relationship('') << MessageBroker
	APIGateway >> Relationship('send data [WebSocket]') >> DocsEditor

	### MessageBroker ###
	MessageBroker >> Relationship('sends events (project.created, project.updated, project.deleted) to Kafka [HTTP/HTTPS]') << ProjectService
	MessageBroker >> Relationship('subscribes to events from Kafka to update users and auth topics [HTTP/HTTPS]') << UsersService
	MessageBroker >> Relationship('get profile and project info and sends events (docs.create ...)') << DocsEditor

	### DocService ###
	DocsEditor >> Relationship('sending prompt [WebSocket]') << LargeLanguageModel
	DocsEditor >> Relationship('sending documentation in text format [HTTP/HTTPS]') << DataBase1
	DocsEditor >> Relationship('sending HTML [WebSocket]') << DocsPublish
