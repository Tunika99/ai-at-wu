import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

/** Null until a Sanity project ID is configured in .env.local */
export const client = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null;
