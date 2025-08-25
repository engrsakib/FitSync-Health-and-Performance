export const config = {
  api_base_url: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
  app_name: "FitSync",
  app_description: "Your Ultimate Fitness Companion",
  default_avatar: "/avatar-default.png",
  mock_users: [
    {
      id: "1",
      name: "Admin User",
      email: "admin@fitsync.dev",
      password: "Admin@123",
      role: "ADMIN" as const,
      avatar: "/avatar-default.png",
    },
    {
      id: "2",
      name: "Trainer User",
      email: "trainer@fitsync.dev",
      password: "Trainer@123",
      role: "TRAINER" as const,
      avatar: "/avatar-default.png",
    },
    {
      id: "3",
      name: "Trainee User",
      email: "trainee@fitsync.dev",
      password: "Trainee@123",
      role: "TRAINEE" as const,
      avatar: "/avatar-default.png",
    },
  ],
}
