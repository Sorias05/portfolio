import { z } from "zod";
import { ObjectId } from "mongodb";
import { UserSchema } from "../user/model";

export const ReviewSchema = z.object({
  title: z.string(),
  stars: z.number().min(1).max(5),
  userId: z
    .instanceof(ObjectId, { message: "Invalid user reference" })
    .or(z.string().length(24, "Invalid ObjectId format")),
  user: z.lazy(() => UserSchema).optional(),
  chosen: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
});
