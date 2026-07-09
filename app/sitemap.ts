import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://fitbharat-web.vercel.app"
  const routes = [
    "",
    "/login",
    "/register",
    "/forgot-password",
    "/splash",
    "/dashboard",
    "/workout",
    "/workout/log",
    "/nutrition",
    "/garden",
    "/analytics",
    "/challenges",
    "/profile",
    "/settings"
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "daily" as const,
    priority: route === "" || route === "/dashboard" ? 1.0 : 0.8
  }))
}
