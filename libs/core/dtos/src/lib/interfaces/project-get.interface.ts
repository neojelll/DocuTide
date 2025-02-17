export interface ProjectGetPayload {
  userId: string;
  projectId: string;
  projectname: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
}
