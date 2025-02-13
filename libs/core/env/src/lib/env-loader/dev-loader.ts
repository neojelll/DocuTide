import { InternalServerErrorException } from '@nestjs/common';

export async function getEnvironmentValue(variableName: string) {
  if (variableName.toUpperCase() !== variableName) {
    throw new InternalServerErrorException('uncorrect variable name');
  }

  const environmentValue = process.env[variableName];

  if (environmentValue === undefined) {
    throw new InternalServerErrorException('value not found in .env file');
  }
}
