import { withAuthOnly } from "@/app/lib/guards/withAuthOnly";
import { getReviews, createReview, getReviewsByUser } from "./service";

export async function POST(req) {
  const auth = await withAuthOnly(req);
  if (auth) return auth;

  return createReview(req);
}

export async function GET(req) {
  const userId = req.headers.get("user-id");
  const onlyChosen = req.headers.get("only-chosen");
  if (userId) {
    return getReviewsByUser(userId);
  }
  return getReviews(onlyChosen);
}
