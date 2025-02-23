export interface ProjectGetPayload {
  userId: string;
  projectId: string;
  projectName: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
}
