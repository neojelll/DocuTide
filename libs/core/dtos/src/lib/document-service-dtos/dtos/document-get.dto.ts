import {
  IsDate,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DocumentGetPayload } from '../../interfaces/document-get.interface';

export class DocumentGetDto {
  @IsUUID()
  @IsNotEmpty()
  documentId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  projectName: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;

  constructor(documentGetPayload: DocumentGetPayload) {
    this.documentId = documentGetPayload.documentId;
    this.projectName = documentGetPayload.projectName;
    this.content = documentGetPayload.content;
    this.createdAt = documentGetPayload.createdAt;
    this.updatedAt = documentGetPayload.updatedAt;
  }

  async stringify(): Promise<string> {
    return JSON.stringify(this, null, 2);
  }
}
