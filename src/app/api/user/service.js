"use server";
import { errors, successes } from "@/constants";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { create, get, getByEmail, getById, update, remove } from "./repository";
import { UserSchema } from "./model";
import { deleteReviewsByUser } from "../review/service";
import { getDB } from "../../lib/mongodb";

export async function createUser(req) {
  try {
    let parsedData;

    if (req instanceof Request) {
      const body = await req.json();
      parsedData = UserSchema.parse(body);
    } else {
      parsedData = UserSchema.parse(req);
    }

    const existingUser = await getByEmail(parsedData.email);

    if (existingUser) {
      return NextResponse.json(errors.modelExists[0], errors.modelExists[1]);
    }

    parsedData.password = await bcrypt.hash(parsedData.password, 10);

    const result = await create(parsedData);

    const { password, ...data } = parsedData;
    return NextResponse.json(data, successes.created);
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}

export async function getUsers() {
  try {
    const users = await get();

    if (!users) {
      return NextResponse.json(errors.notFound[0], errors.notFound[1]);
    }

    const sanitarizedUsers = users.map(({ password, ...data }) => data);

    return NextResponse.json(sanitarizedUsers, successes.success);
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}

export async function getUserById(id) {
  try {
    const user = await getById(id);

    if (!user) {
      return NextResponse.json(errors.notFound[0], errors.notFound[1]);
    }

    const { password, ...data } = user;

    return NextResponse.json(data, successes.success);
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}

export async function getUserByEmail(email) {
  try {
    const user = await getByEmail(email);

    if (!user) {
      return NextResponse.json(errors.notFound[0], errors.notFound[1]);
    }

    const { password, ...data } = user;

    return data;
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}

export async function getUserWithPassword(email) {
  try {
    const user = await getByEmail(email);

    if (!user) {
      return NextResponse.json(errors.notFound[0], errors.notFound[1]);
    }

    return user;
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}

export async function updateUser(id, req) {
  try {
    const body = await req.json();
    const parsedData = UserSchema.partial().parse(body);

    if (parsedData?.email) {
      const existingUser = await getByEmail(parsedData.email);
      if (existingUser && existingUser._id.toString() !== id) {
        return NextResponse.json(errors.modelExists[0], errors.modelExists[1]);
      }
    }

    let data;
    if (parsedData?.password) {
      parsedData.password = await bcrypt.hash(parsedData.password, 10);
      const { password, ...other } = parsedData;
      data = other;
    } else {
      data = parsedData;
    }

    const result = await update(id, parsedData);

    if (result.matchedCount === 0) {
      return NextResponse.json(errors.notFound[0], errors.notFound[1]);
    }

    return NextResponse.json({ id, ...data }, successes.success);
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  }
}

export async function deleteUser(id) {
  const db = await getDB();
  const session = db.client.startSession();

  try {
    await session.withTransaction(async () => {
      await deleteReviewsByUser(id, session);

      const result = await remove(id, session);

      if (result.deletedCount === 0) {
        throw new Error("User not found");
      }
    });

    return NextResponse.json(
      { message: `Removed user with id: ${id}` },
      successes.success
    );
  } catch (error) {
    return NextResponse.json(
      errors.internalServerError[0],
      errors.internalServerError[1]
    );
  } finally {
    await session.endSession();
  }
}