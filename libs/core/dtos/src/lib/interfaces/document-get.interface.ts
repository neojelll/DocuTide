export interface DocumentGetPayload<T> {
  documentId: string;
  projectId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: T | string | Date;
}
