import { errors, successes } from "@/constants";
import { NextResponse } from "next/server";
import { create, get, getById, remove, update } from "./repository";
import { ProjectSchema } from "./model";

export async function createProject(req) {
  try {
    const body = await req.json();
    const { tags, tag_ids, ...project } = body;
    const parsedData = ProjectSchema.parse(project);

    const result = await create(parsedData, tag_ids);

    return NextResponse.json(parsedData, successes.created);
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}

export async function getProjects() {
  try {
    const projects = await get();

    if (!projects) {
      return NextResponse.json(errors.notFound[0], errors.notFound[1]);
    }

    return NextResponse.json(projects, successes.success);
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}

export async function getProjectById(id) {
  try {
    const project = await getById(id);
    
    if (!project) {
      return NextResponse.json(errors.notFound[0], errors.notFound[1]);
    }

    return NextResponse.json(project, successes.success);
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}

export async function updateProject(id, req) {
  try {
    const body = await req.json();
    const { _id, createdAt, tag_ids, tags, projectTags, ...rest } = body;

    const parsedData = ProjectSchema.partial().parse(rest);

    const result = await update(id, parsedData, tag_ids);

    return NextResponse.json({ id, ...parsedData }, successes.success);
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}

export async function deleteProject(id) {
  try {
    const result = await remove(id);

    return NextResponse.json(
      { message: `Removed project with id: ${id}` },
      successes.success
    );
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}
