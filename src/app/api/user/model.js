import { z } from "zod";
import { ReviewSchema } from "../review/model";
import { noImage } from "@/constants";

export const UserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string(),
  image: z.string().default(noImage),
  organization: z.string().optional(),
  position: z.string().optional(),
  isCompleted: z.boolean().default(false),
  reviews: z.lazy(() => z.array(ReviewSchema)).optional(),
});
