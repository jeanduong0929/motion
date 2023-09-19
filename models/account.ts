import User from "./user";

export default interface Account {
  id: string;
  providerId: string;
  providerType: string;
  user: User;
}
