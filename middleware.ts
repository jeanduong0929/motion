export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/create",
    "/notes",
    "/profile",
    "/settings",
  ],
};
