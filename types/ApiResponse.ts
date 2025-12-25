import { Conversation } from "../models/User.model";

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  conversation?: Array<Conversation>;
}
