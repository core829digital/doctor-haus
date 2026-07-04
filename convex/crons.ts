import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval("check-pending-reviews", { hours: 24 }, internal.reviewRequests.checkAndSendReviewRequests);

crons.interval("create-pending-reviews", { hours: 24 }, internal.reviewRequests.createPendingReviewsIfNeeded);

export default crons;
