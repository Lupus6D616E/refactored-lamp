import { Elysia, status } from "elysia";
import { betterAuthPlugin } from "@lib/auth";
import { s3Client } from "@lib/minio";

const env = process.env.NODE_ENV || 'development';

export const imagePlugin = new Elysia({ prefix: "/static" })
  .use(betterAuthPlugin)
  .get("/images/news/:filename", async ({ params: { filename } }) => {
    try {
      const file = await s3Client.file(`news/${filename}`)
      return file
    }
    catch {
      return {
        message: "lol"
      }
    }
  })
  .get("/images/profilepicture/user/:id", async ({ params: { id } }) => {
    try {
      const file = await s3Client.file(`profile/${id}/pfp`)
      return file
    }
    catch {
      return {
        message: "lol"
      }
    }
  }
  )
  .get("/images/business/:id/profilepicture", async ({ params: { id } }) => {
    try {
      const file = await s3Client.file(`business/${id}/pfp`)
      return file
    }
    catch {
      return {
        message: "lol"
      }
    }
  }
  )
  .get("/images/business/:id/banner", async ({ params: { id } }) => {
    try {
      const file = await s3Client.file(`business/${id}/banner`)
      return file
    }
    catch {
      return {
        message: "lol"
      }
    }
  }
  )

  .get("/images/assets/:filename", async ({ params: { filename} }) => {
    try {
      const file = await s3Client.file(`assets/${filename}`)
      return file
    }
    catch {
      return {
        message: "lol"
      }
    }
  }
  )

