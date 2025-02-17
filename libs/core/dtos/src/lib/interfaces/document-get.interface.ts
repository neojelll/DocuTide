export interface DocumentGetPayload {
  documentId: string;
  projectname: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
}
