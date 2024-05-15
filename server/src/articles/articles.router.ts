import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { Tag } from "@prisma/client";

/**
 * Router for handling articles-related routes.
 *
 * @param app - The Fastify instance.
 */
export const articlesRouter: FastifyPluginAsyncJsonSchemaToTs = async (app) => {
  /**
   * Get all articles
   * GET /api/articles
   */
  app.route({
    method: "GET",
    url: "/",
    schema: {
      description: "Get all articles",
      tags: ["articles"],
      querystring: {
        type: "object",
        properties: {
          categoryId: { type: "string" },
          tags: { type: "array", items: { type: "string" } },
          page: { type: "number" },
          limit: { type: "number" },
        },
      },
    },
    handler: async (request, reply) => {
      const { categoryId, tags, page = 1, limit = 50 } = request.query;
      const tagsQuery = tags ? { tags: { some: { id: { in: tags } } } } : {};

      return app.prisma.article.findMany({
        where: {
          categoryId,
          ...tagsQuery,
        },
        include: { tags: true },
        orderBy: { id: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      });
    },
  });

  /**
   * Get a single article by id
   * GET /api/articles/:id
   */
  app.route({
    method: "GET",
    url: "/:id",
    schema: {
      description: "Get a single article by id",
      tags: ["articles"],
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
      },
    } as const,
    handler: async (request, reply) => {
      const { id } = request.params;
      return app.prisma.article.findUnique({
        where: { id: Number(id) },
        include: { tags: true },
      });
    },
  });

  /**
   * Create an article
   * POST /api/articles
   */
  app.route({
    method: "POST",
    url: "/",
    schema: {
      description: "Create an article",
      tags: ["articles"],
      body: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          body: { type: "string" },
          categoryId: { type: "string" },
          tags: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                title: { type: "string" },
                description: { type: "string" },
              },
            },
          },
        } as const,
        required: ["title", "description", "body", "categoryId", "tags"],
      },
    },
    handler: async (request, reply) => {
      const { title, description, body, categoryId, tags } = request.body;

      // create tags if they don't exist
      for await (const tag of tags) {
        const existingTag = await app.prisma.tag.findUnique({
          where: { id: tag.id },
        });
        if (!existingTag) {
          await app.prisma.tag.create({
            data: tag as Tag,
          });
        }
      }

      return app.prisma.article.create({
        data: {
          title,
          description,
          body,
          categoryId,
          tags: {
            connect: tags.map((tag) => {
              return { id: tag.id };
            }),
          },
        },
      });
    },
  });

  /**
   * Update an article
   * PUT /api/articles/:id
   */
  app.route({
    method: "PUT",
    url: "/:id",
    schema: {
      description: "Update an article",
      tags: ["articles"],
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
      },
      body: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          body: { type: "string" },
          categoryId: { type: "string" },
          tags: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                title: { type: "string" },
                description: { type: "string" },
              },
            },
          },
        } as const,
        required: ["title", "description", "body", "categoryId", "tags"],
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      const { title, description, body, categoryId, tags } = request.body;

      // create tags if they don't exist
      for await (const tag of tags) {
        const existingTag = await app.prisma.tag.findUnique({
          where: { id: tag.id },
        });
        if (!existingTag) {
          await app.prisma.tag.create({
            data: tag as Tag,
          });
        }
      }

      return app.prisma.article.update({
        where: { id: Number(id) },
        data: {
          title,
          description,
          body,
          categoryId,
          tags: {
            set: tags.map((tag) => {
              return { id: tag.id };
            }),
          },
        },
      });
    },
  });

  /**
   * Delete an article
   * DELETE /api/articles/:id
   */
  app.route({
    method: "DELETE",
    url: "/:id",
    schema: {
      description: "Delete an article",
      tags: ["articles"],
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      return app.prisma.article.delete({
        where: { id: Number(id) },
      });
    },
  });

  /**
   * Get all tags
   * GET /api/articles/tags
   */
  app.route({
    method: "GET",
    url: "/tags",
    schema: {
      description: "Get all tags",
      tags: ["tags"],
    },
    handler: async (request, reply) => {
      return app.prisma.tag.findMany();
    },
  });

  /**
   * Create a tag
   * POST /api/articles/tags
   */
  app.route({
    method: "POST",
    url: "/tags",
    schema: {
      description: "Create a tag",
      tags: ["tags"],
      body: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
        } as const,
        required: ["title"],
      },
    },
    handler: async (request, reply) => {
      const { title, description } = request.body;
      return app.prisma.tag.create({
        data: {
          id: title.toLowerCase().replace(/\s/g, "-"),
          title,
          description: description || "",
        },
      });
    },
  });
};
