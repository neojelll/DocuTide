export class VariableNameUncorrect extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VariableNameUncorrect';
  }
}

export class VariableNameNotFound extends Error {
  public readonly variableName: string;

  constructor(message: string, variableName: string) {
    super(message);
    this.name = 'VariableNameNotFound';
    this.variableName = variableName;
  }
}
