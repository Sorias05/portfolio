import { getReviews, createReview, getReviewsByUser } from "./service";

export async function POST(req) {
  return createReview(req);
}

export async function GET(req) {
  const userId = req.headers.get("user-id");
  if (userId) {
    return getReviewsByUser(userId);
  }
  return getReviews();
}
