import { Elysia, t } from "elysia";
import { searchModel } from "./model";
import { Search } from "./service";
import { betterAuthPlugin } from "@lib/auth";
export const searchPlugin = new Elysia({ prefix: "/search" }) // optional prefix
.use(betterAuthPlugin)
  .get(
    "/jobpost",
    async ({ query }) => {
      // query is fully typed!
      console.log("Received filters:", query);
      const result = await Search.findjobpost(query);
      console.log(result);
      return {
        results: result, // ← your actual results
      };
    },
    {
      // Define expected query schema → full type-safety + validation
      query: searchModel.searchJobQuery,
    },
  )
  .get(
    "/seeker",
    async ({ query }) => {
      // query is fully typed!
      console.log("Received filters:", query);
      const result = await Search.findSeeker(query);
      console.log(result);
      return {
        result: result, // ← your actual results
      };
    },
    { 
      role: ['admin'],
      query: searchModel.searchUserQuery,
    },
  )
  .get(
    "/businessuser",
    async ({ query }) => {
      // query is fully typed!
      console.log("Received filters:", query);
      const result = await Search.findBusinessUser(query);
      console.log(result);
      return {
        result: result, // ← your actual results
      };
    },
    {
      role: ['admin'],
      query: searchModel.searchUserQuery,
    },
  );
