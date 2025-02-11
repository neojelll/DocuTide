import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  constructor(private readonly options?: any) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    if (metatype || this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);

    const errors = await validate(object, this.options);

    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }

    return object;
  }

  private toValidate(metatype: any) {
    const types = [String, Boolean, Number, Array, Object];

    return !types.includes(metatype);
  }
}
