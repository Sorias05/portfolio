import { z } from "zod";
import { noImage2 } from "@/constants";

export const TagSchema = z.object({
  title: z.string(),
  image: z.string().default(noImage2),
  color: z.string().default("#000000"),
  isDark: z.preprocess(
    (val) => val === "true" || val === true,
    z.boolean().default(true)
  ),
  createdAt: z.date().default(() => new Date()),
});
