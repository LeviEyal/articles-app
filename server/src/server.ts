import fastify from "fastify";
import { prismaPlugin, swaggerPlugin } from "./plugins";
import { articlesRouter } from "./articles/articles.router";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { categoriesRouter } from "./categories/categories.router";

const server = fastify({
  logger: true,
}).withTypeProvider<JsonSchemaToTsProvider>();

/**
 * Starts the server by registering plugins, routers, and listening on a specified port.
 */
async function start() {
  try {
    await server.register(prismaPlugin);
    await server.register(swaggerPlugin, { prefix: "api/docs" });

    await server.register(articlesRouter, { prefix: "api/articles" });
    await server.register(categoriesRouter, { prefix: "api/categories" });

    await server.ready();
    await server.listen({ port: 3000 });
    console.log(`🚀 Server ready at: http://localhost:3000`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
