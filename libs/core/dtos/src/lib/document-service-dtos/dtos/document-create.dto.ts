import { JwtPayload } from '@docu-tide/core/auth';
import {
  IsNotEmpty,
  IsObject,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ValidationDocumentCreateDto } from '../validation-dtos/document-create-validation.dto';

export class DocumentCreateDto extends ValidationDocumentCreateDto {
  @IsObject()
  @IsNotEmpty()
  jwtPayload: JwtPayload;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  projectName: string;
}
