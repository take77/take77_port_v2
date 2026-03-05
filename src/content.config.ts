import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const serviceCategoryEnum = z.enum([
  "system-development",
  "web-development",
  "business-planning",
  "video-editing",
]);

const works = defineCollection({
  loader: glob({ pattern: "**/index.md", base: "./content/works" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      client: z.string().optional(),
      serviceCategory: z.array(serviceCategoryEnum).min(1),
      technologies: z.array(z.string()).default([]),
      thumbnail: image(),
      url: z.string().url().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      order: z.number().default(100),
    }),
});

export const collections = { works };
