import { z } from "zod";
import { noImage2 } from "@/constants";

export const ExperienceSchema = z.object({
  name: z.string(),
  position: z.string(),
  start: z.string().regex(/^\d{4}-\d{2}$/),
  end: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  image: z.string().default(noImage2),
  description: z.string(),
  animation: z.string(),
  createdAt: z.date().default(() => new Date()),
});
