import { z } from "zod";
import { ObjectId } from "mongodb";
import { ProjectSchema } from "../project/model";

export const ProjectTagSchema = z.object({
  projectId: z
    .instanceof(ObjectId, { message: "Invalid project reference" })
    .or(z.string().length(24, "Invalid ObjectId format")),
  project: z.lazy(() => ProjectSchema).optional(),
  tagId: z
    .instanceof(ObjectId, { message: "Invalid tag reference" })
    .or(z.string().length(24, "Invalid ObjectId format")),
  tag: z.lazy(() => TagSchema).optional(),
  createdAt: z.date().default(() => new Date()),
});
