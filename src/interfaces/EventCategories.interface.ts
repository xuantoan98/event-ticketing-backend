import { Status } from "../constants/enum";

export interface IEventCategories {
  _id: string;
  name: string;
  description: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}
