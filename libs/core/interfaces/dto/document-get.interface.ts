export interface DocumentGetPayload {
  documentId: string;
  projectId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
}
