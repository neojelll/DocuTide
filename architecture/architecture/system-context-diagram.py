from diagrams import Diagram
from diagrams.c4 import (
	Person,
    Relationship,
    SystemBoundary,
    System,
)


PathSaveFile = 'diagrams/system-context-diagram'
GraphAttr = {
	'splines': 'spline',
}


with Diagram(filename=PathSaveFile, show=False, direction='TB', graph_attr=GraphAttr):
	User = Person(
		name='User',
		description='interacts with a convenient service interface',
	)

	DocuTide = System(
		name='DocuTide',
		description='our service for creating, editing and posting documentation on the service subdomain',
		external=False,
	)

	LargeLanguageModel = System(
		name='LargeLanguageModel',
		description='to correct texts and help with writing',
		external=True,
	)

	with SystemBoundary('ExternalServiceIntegrarion'):
		GoogleServices = System(
			name='GoogleServices',
			description='integration with Google services',
			external=True,
		)

	### user ###
	User >> Relationship('uses service') << DocuTide

	### DocuTide ###
	DocuTide >> Relationship('send prompt and get report') << LargeLanguageModel
	DocuTide >> Relationship('import and export data') << GoogleServices
