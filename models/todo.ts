import Auth from "./auth";

export default interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  user?: Auth;
}
