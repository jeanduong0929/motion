import { Session } from "next-auth";

interface MySession extends Session {
  jwt: string;
}
