import {
  IsNotEmpty,
  IsObject,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { JwtPayload } from '../../../interfaces/jwt/jwt.interface';
import { ValidationDocumentUpdateDto } from '../validation-dto/document-update-validation.dto';

export class DocumentUpdateDto extends ValidationDocumentUpdateDto {
  @IsObject()
  @IsNotEmpty()
  jwtPayload: JwtPayload;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  projectId: string;
}
