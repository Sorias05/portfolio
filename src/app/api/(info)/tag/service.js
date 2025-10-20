import { errors, successes } from "@/constants";
import { NextResponse } from "next/server";
import { create, get, getById, update, remove } from "./repository";
import { TagSchema } from "./model";

export async function createTag(req) {
  try {
    const body = await req.json();
    const parsedData = TagSchema.parse(body);

    const result = await create(parsedData);

    return NextResponse.json(parsedData, successes.created);
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}

export async function getTags() {
  try {
    const tags = await get();

    if (!tags) {
      return NextResponse.json(errors.notFound[0], errors.notFound[1]);
    }

    return NextResponse.json(tags, successes.success);
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}

export async function getTagById(id) {
  try {
    const tag = await getById(id);

    if (!tag) {
      return NextResponse.json(errors.notFound[0], errors.notFound[1]);
    }

    return NextResponse.json(tag, successes.success);
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}

export async function updateTag(id, req) {
  try {
    const body = await req.json();

    const { _id, createdAt, ...rest } = body;
    const parsedData = TagSchema.partial().parse(rest);

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

export async function deleteTag(id) {
  try {
    const result = await remove(id);

    return NextResponse.json(
      { message: `Removed tag with id: ${id}` },
      successes.success
    );
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}
