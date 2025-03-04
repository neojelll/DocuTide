from pathlib import Path
from diagrams import Diagram
from diagrams.plantuml import PlantUML

diagram_files = [
    "SystemContext",
    "Containers",
    "DocsEditorRelationships",
    "MessageBrokerRelationships",
    "MVP"
]

output_dir = Path("../diagrams")
output_dir.mkdir(exist_ok=True)

for diagram in diagram_files:
    input_file = Path(f"{diagram}.puml")
    output_file = output_dir / f"{diagram.lower()}-diagram.png"

    with Diagram(filename=str(output_file.stem), outformat="png", show=False):
        PlantUML(str(input_file))()
