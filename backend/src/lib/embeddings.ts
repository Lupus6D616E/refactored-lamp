// embedding.ts
import { pipeline } from '@huggingface/transformers';

// Only needed if you want to force local files / disable remote fallback (optional)
import { env } from '@huggingface/transformers';
import { Post } from '@modules/post/service';
import { Profile } from '@modules/profile/service';
env.cacheDir = './.cache/hf';           // where models are stored
// env.allowRemoteModels = true;        // default = true
// env.allowLocalModels  = true;        // default = true

// ────────────────────────────────────────────────
const model_id = 'Xenova/bge-large-en-v1.5';     // ← Xenova = optimized ONNX version

// Load once (usually keep this as a module-level singleton)
const extractor = await pipeline(
    'feature-extraction',
    model_id,
    // Optional: much faster & lower memory (q8 or q4 recommended)
    // { quantized: true }               // auto picks best quantized version
    // or explicitly:
    // { dtype: 'q8' } or { dtype: 'q4f16' }
);

// Optional: mean pooling + L2 normalize (what .encode() does in Python)
function mean_pooling(output: any, attention_mask: any) {
    const mask = attention_mask.unsqueeze(-1).expand(output.shape).to(output.dtype);
    const masked = output.masked_fill(mask.eq(0), 0);
    const sum = masked.sum(1);
    const count = mask.sum(1);
    return sum.div(count);
}

function normalize(emb: any) {
    const norm = emb.norm(2, -1, true);
    return emb.div(norm);
}

// ────────────────────────────────────────────────
export async function getEmbedding(text: string){
    // Can pass single string or array of strings
    const output = await extractor(text, {
        pooling: 'mean',          // most common choice
        normalize: true,          // L2 normalization (cosine similarity ready)
        
    });

    // output is usually shape [batch, sequence, hidden] → we want [batch, hidden]
    // With pooling: 'mean' + normalize: true → already [batch, 384]

    return output
}

// ────────────────────────────────────────────────
// Example usage


import { db } from "@db/db"
import { jobPostEmbedding, jobPosts, seekerProfile, seekerProfileEmbedding, user,  } from "@db/schema";
import { notExists, eq, and, exists } from "drizzle-orm";

if (import.meta.main) {
    createjobembeddings()

}


async function createuserembeddings(){
    const users = await db
  .select()
  .from(user)
  .where(
    and(
    notExists(
      db
        .select()
        .from(seekerProfileEmbedding)
        .where(eq(seekerProfileEmbedding.userid, user.id))
    ),
    exists(
        db
          .select() // minimal select for existence check
          .from(seekerProfile)
          .where(eq(seekerProfile.userId, user.id)) // adjust column name if needed
    )
)
  )
for (const user of users) {
    console.log(`doing ${user.name}`)
  await Profile.insertCreatedEmbedding(user.id);
}
}
async function createjobembeddings(){
    const jobpostlist = await db
    .select()
    .from(jobPosts)
    .where(
        notExists(
            db.select()
            .from(jobPostEmbedding)
            .where(eq(jobPostEmbedding.postid, jobPosts.id))
        )
    )

for (const jobPost of jobpostlist) {
    console.log(`doing ${jobPost.id}`)
    await Post.embedJobPost(jobPost.id);
}

}