import { z } from "zod";
export const userNamevalidation = z
  .string()
  .trim()
  .min(2, "Username must be at least 2 characters long")
  .max(30, "Username must be at most 30 characters long")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores"
  );
export const signUpSchema = z.object({
  username: userNamevalidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must be at most 100 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});
