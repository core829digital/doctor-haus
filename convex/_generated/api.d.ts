/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as adminAuth from "../adminAuth.js";
import type * as analytics from "../analytics.js";
import type * as configurationDrafts from "../configurationDrafts.js";
import type * as crons from "../crons.js";
import type * as customerAuth from "../customerAuth.js";
import type * as email from "../email.js";
import type * as internal_ from "../internal.js";
import type * as media from "../media.js";
import type * as notifications from "../notifications.js";
import type * as optionCategories from "../optionCategories.js";
import type * as optionChoices from "../optionChoices.js";
import type * as productLayouts from "../productLayouts.js";
import type * as products from "../products.js";
import type * as quoteRequests from "../quoteRequests.js";
import type * as reviewRequests from "../reviewRequests.js";
import type * as seed from "../seed.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adminAuth: typeof adminAuth;
  analytics: typeof analytics;
  configurationDrafts: typeof configurationDrafts;
  crons: typeof crons;
  customerAuth: typeof customerAuth;
  email: typeof email;
  internal: typeof internal_;
  media: typeof media;
  notifications: typeof notifications;
  optionCategories: typeof optionCategories;
  optionChoices: typeof optionChoices;
  productLayouts: typeof productLayouts;
  products: typeof products;
  quoteRequests: typeof quoteRequests;
  reviewRequests: typeof reviewRequests;
  seed: typeof seed;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
