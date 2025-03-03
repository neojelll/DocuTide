export interface CustomErrorInterface {
  name: string;
  message: string;
  statusCode: number;
  isOperational: boolean;
  timestamp: Date;
}
