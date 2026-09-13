import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => ctx.db.query("conversations").order("desc").collect(),
});

export const create = mutation({
  args: { title: v.string() },
  handler: async (ctx, { title }) =>
    ctx.db.insert("conversations", { title, createdAt: Date.now() }),
});
