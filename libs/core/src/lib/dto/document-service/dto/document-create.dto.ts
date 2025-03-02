import { JwtPayload } from '@docu-tide/auth';
import {
  IsNotEmpty,
  IsObject,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ValidationDocumentCreateDto } from '../validation-dto/document-create-validation.dto';

export class DocumentCreateDto extends ValidationDocumentCreateDto {
  @IsObject()
  @IsNotEmpty()
  jwtPayload: JwtPayload;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  projectId: string;
}
