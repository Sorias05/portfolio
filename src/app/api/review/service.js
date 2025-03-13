import { errors, successes } from "@/constants";
import { NextResponse } from "next/server";
import {
  create,
  get,
  getByUser,
  getById,
  update,
  remove,
  removeByUser,
} from "./repository";
import { ReviewSchema } from "./model";
import { getUserById } from "../user/service";

export async function createReview(req) {
  try {
    const body = await req.json();
    const parsedData = ReviewSchema.parse(body);

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

export async function getReviews() {
  try {
    const reviews = await get();

    if (!reviews) {
      return NextResponse.json(errors.notFound[0], errors.notFound[1]);
    }

    return NextResponse.json(reviews, successes.success);
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}

export async function getReviewsByUser(userId) {
  try {
    const reviews = await getByUser(userId);

    if (!reviews) {
      return NextResponse.json(errors.notFound[0], errors.notFound[1]);
    }

    return NextResponse.json(reviews, successes.success);
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}

export async function getReviewById(id) {
  try {
    const review = await getById(id);

    if (!review) {
      return NextResponse.json(errors.notFound[0], errors.notFound[1]);
    }

    return NextResponse.json(review, successes.success);
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}

export async function updateReview(id, req) {
  try {
    const body = await req.json();
    const parsedData = ReviewSchema.partial().parse(body);

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

export async function deleteReview(id) {
  try {
    const result = await remove(id);

    if (result.deletedCount === 0) {
      return NextResponse.json(errors.notFound[0], errors.notFound[1]);
    }

    return NextResponse.json(
      { message: `Removed review with id: ${id}` },
      successes.success
    );
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}

export async function deleteReviewsByUser(userId, session) {
  try {
    const result = await removeByUser(userId, session);

    if (result.deletedCount === 0) {
      return NextResponse.json(errors.notFound[0], errors.notFound[1]);
    }
    const message = `Removed all reviews for user with id: ${userId}`;
    return NextResponse.json({ message }, successes.success);
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}
