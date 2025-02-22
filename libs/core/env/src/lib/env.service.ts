import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  VariableNameNotFound,
  VariableNameUncorrect,
} from './env-errors/env-errors';

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService) {}

  async getEnvValue<T>(
    variableName: string,
    defaultValue?: T,
  ): Promise<string | T> {
    if (variableName !== variableName.toUpperCase()) {
      throw new VariableNameUncorrect('variable name must be in upper case');
    }

    const environmentValue = this.configService.get<string>(variableName);

    if (environmentValue) {
      return environmentValue;
    }

    if (defaultValue === undefined) {
      throw new VariableNameNotFound(
        'there is no variable with that name in the env file',
        variableName,
      );
    }

    return defaultValue;
  }
}
