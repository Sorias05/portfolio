import { errors, successes } from "@/constants";
import { NextResponse } from "next/server";
import {
  create,
  get,
  getById,
  update,
  remove,
} from "./repository";
import { ExperienceSchema } from "./model";

export async function createExperience(req) {
  try {
    const body = await req.json();
    const parsedData = ExperienceSchema.parse(body);

    const result = await create(parsedData);

    return NextResponse.json(parsedData, successes.created);
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}

export async function getExperiences() {
  try {
    const experiences = await get();

    if (!experiences) {
      return NextResponse.json(errors.notFound[0], errors.notFound[1]);
    }

    return NextResponse.json(experiences, successes.success);
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}

export async function getExperienceById(id) {
  try {
    const experience = await getById(id);

    if (!experience) {
      return NextResponse.json(errors.notFound[0], errors.notFound[1]);
    }

    return NextResponse.json(experience, successes.success);
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}

export async function updateExperience(id, req) {
  try {
    const body = await req.json();
    const { _id, createdAt, ...rest } = body;
    const parsedData = ExperienceSchema.partial().parse(rest);

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

export async function deleteExperience(id) {
  try {
    const result = await remove(id);

    if (result.deletedCount === 0) {
      return NextResponse.json(errors.notFound[0], errors.notFound[1]);
    }

    return NextResponse.json(
      { message: `Removed experience with id: ${id}` },
      successes.success
    );
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}
