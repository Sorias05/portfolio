import { z } from "zod";

export const ProjectSchema = z.object({
  title: z.string(),
  url: z.string().optional(),
  image: z.string().optional(),
  description: z.string(),
  start: z.string().regex(/^\d{4}-\d{2}$/),
  end: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  video: z.string().optional(),
  clickable: z.preprocess(
    (val) => val === "true" || val === true,
    z.boolean().default(false)
  ),
  pet: z.preprocess(
    (val) => val === "true" || val === true,
    z.boolean().default(true)
  ),
  createdAt: z.date().default(() => new Date()),
});
