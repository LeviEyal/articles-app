import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";

/**
 * Router for handling category-related routes.
 *
 * @param app - The Fastify instance.
 */
export const categoriesRouter: FastifyPluginAsyncJsonSchemaToTs = async (
  app
) => {
  app.route({
    method: "GET",
    url: "/",
    schema: {
      description: "Get all categories",
      tags: ["categories"],
    },
    handler: async (request, reply) => {
      return app.prisma.category.findMany();
    },
  });

  app.route({
    method: "GET",
    url: "/:id",
    schema: {
      description: "Get a single category by id",
      tags: ["categories"],
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
      },
    } as const,
    handler: async (request, reply) => {
      const { id } = request.params;
      return app.prisma.category.findUnique({
        where: { id },
      });
    },
  });

  app.route({
    method: "POST",
    url: "/",
    schema: {
      description: "Create a new category",
      tags: ["categories"],
      body: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
        } as const,
        required: ["title", "description"],
      },
    } as const,
    handler: async (request, reply) => {
      const { title, description } = request.body;
      return app.prisma.category.create({
        data: {
          id: title.toLowerCase().replace(/\s/g, "-"),
          title,
          description,
        },
      });
    },
  });
};
