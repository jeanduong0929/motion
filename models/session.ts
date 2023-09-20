import { Session } from "next-auth";

export default interface MySession extends Session {
  id: string;
  jwt: string;
}
