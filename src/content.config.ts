import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";


const projects = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            author: z.string(),
            pubDate: z.coerce.date(),
            description: z.string().optional(),
            tags: z.array(z.string()).optional().default([]),
            thumbnail: image().optional(),
            thumbnailAlt: z.string().optional(),
            url: z.string().url().optional(),
        }),
});

const blog = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
    schema: z.object({
        title: z.string(),
        author: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        tags: z.array(z.string()),
    }),
});


export const collections = { blog, projects };



