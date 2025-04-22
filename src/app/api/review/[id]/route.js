import { withAuthorization } from "@/app/lib/guards/withAuthorization";
import { deleteReview, getReviewById, updateReview } from "../service";
import { getById } from "../repository";

export async function GET(req) {
  const id = new URL(req.url).pathname.split("/").pop();
  const review = await getById(id);

  const authCheck = await withAuthorization(req, review.userId);
  if (authCheck) return authCheck;

  return getReviewById(id);
}

export async function PUT(req) {
  const id = new URL(req.url).pathname.split("/").pop();
  const review = await getById(id);

  const authCheck = await withAuthorization(req, review.userId);
  if (authCheck) return authCheck;

  return updateReview(id, req);
}

export async function DELETE(req) {
  const id = new URL(req.url).pathname.split("/").pop();
  const review = await getById(id); 

  const authCheck = await withAuthorization(req, review.userId);
  if (authCheck) return authCheck;

  return deleteReview(id);
}
