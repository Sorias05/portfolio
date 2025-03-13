import { deleteReview, getReviewById, updateReview } from "../service";

export async function GET(req) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  return getReviewById(id);
}

export async function PUT(req) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  return updateReview(id, req);
}

export async function DELETE(req) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  return deleteReview(id);
}
