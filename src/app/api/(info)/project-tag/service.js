import { errors, successes } from "@/constants";
import { NextResponse } from "next/server";
import {
  create,
  get,
  getById,
  update,
  remove,
} from "./repository";
import { ProjectTagSchema } from "./model";

export async function createProjectTag(req) {
  try {
    const body = await req.json();
    const parsedData = ProjectTagSchema.parse(body);

    const user = await getUserById(parsedData.userId);
    if (!user) {
      return NextResponse.json(errors.notFound[0], errors.notFound[1]);
    }

    const result = await create(parsedData);

    return NextResponse.json(parsedData, successes.created);
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}

export async function getProjectTags() {
  try {
    const projectTags = await get();

    if (!projectTags) {
      return NextResponse.json(errors.notFound[0], errors.notFound[1]);
    }

    return NextResponse.json(projectTags, successes.success);
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}

export async function getProjectTagById(id) {
  try {
    const projectTag = await getById(id);

    if (!projectTag) {
      return NextResponse.json(errors.notFound[0], errors.notFound[1]);
    }

    return NextResponse.json(projectTag, successes.success);
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}

export async function updateProjectTag(id, req) {
  try {
    const body = await req.json();
    const { _id, createdAt, ...rest } = body;
    const parsedData = ProjectTagSchema.partial().parse(rest);

    const result = await update(id, parsedData);

    if (result.matchedCount === 0) {
      return NextResponse.json(errors.notFound[0], errors.notFound[1]);
    }

    return NextResponse.json({ id, ...parsedData }, successes.success);
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}

export async function deleteProjectTag(id) {
  try {
    const result = await remove(id);

    if (result.deletedCount === 0) {
      return NextResponse.json(errors.notFound[0], errors.notFound[1]);
    }

    return NextResponse.json(
      { message: `Removed projectTag with id: ${id}` },
      successes.success
    );
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}
