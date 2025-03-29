export {default} from "next-auth/middleware";

export const config = {
  matcher: ["/api/team/join/:path*", "/api/challenges/:path*"],
};
