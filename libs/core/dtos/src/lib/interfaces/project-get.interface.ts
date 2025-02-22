export interface ProjectGetPayload<T> {
  userId: string;
  projectId: string;
  projectName: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: T | string | Date;
}
