import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		publishedAt: z.coerce.date(),
		canonicalId: z.string(),
	}),
});

const blog_ja = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		publishedAt: z.coerce.date(),
		canonicalId: z.string(),
	}),
});

export const collections = { blog, blog_ja };
