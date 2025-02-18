export interface DocumentGetPayload {
  documentId: string;
  projectName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
}
