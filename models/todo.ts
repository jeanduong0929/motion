import Auth from "./auth";

export default interface Todo {
  id: string;
  title: string;
  completed: boolean;
  user?: Auth;
}
