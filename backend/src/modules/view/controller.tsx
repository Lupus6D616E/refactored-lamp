import { Elysia, t } from "elysia";
import { View } from "./service";
export const viewPlugin = new Elysia({ prefix: "/view" }) // optional prefix
  .get(
    "/job/:id",
    async ({ params: { id } }) => {
      // query is fully typed!
      console.log("Viewed post:", id);
      const result = await View.getPostDetails(id);
      console.log(result);
      return result;
    },
    {
      // Define expected query schema → full type-safety + validation
      params: t.Object({
        id: t.Number(),
      }),
    },
  );
