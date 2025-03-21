export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/api/team/:path*",
    "/api/challenges/:path*"
  ]
};