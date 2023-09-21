import axios from "axios";

const instance = axios.create({
  baseURL: "https://motion-two-topaz.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
