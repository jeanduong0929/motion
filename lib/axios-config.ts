import axios from "axios";

const instance = axios.create({
  baseURL: "http://motion-puce.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
