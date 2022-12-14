import fastify from "fastify";

import type { FastifyCorsOptionsDelegateCallback } from "@fastify/cors";

async function createServer() {
  const app = fastify({
    logger: {
      level: "debug",
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "SYS:HH:MM:ss Z +L",
          ignore: "pid,hostname",
        },
      },
    },
  });

  /**
   * This example fails with origin undefined, causing new URL to throw an error.
   * @see https://github.com/fastify/fastify-cors#options for the example code
   */
  // await app.register(import("@fastify/cors"), {
  //   origin: (
  //     origin: string,
  //     callback: (error: Error | null, allow: boolean) => void
  //   ) => {
  //     // Always undefined
  //     console.log({ origin });
  //     const { hostname } = new URL(origin);
  //     if (hostname === "localhost") {
  //       callback(null, true);
  //       return;
  //     }
  //     // Generate an error on other origins, disabling access
  //     callback(new Error("Not allowed"), false);
  //   },
  // });

  /**
   * This example will pass due to it's setup but origin is always undefined.
   * @see https://github.com/fastify/fastify-cors#configuring-cors-asynchronously for the example code
   */
  await app.register(
    import("@fastify/cors"),
    (): FastifyCorsOptionsDelegateCallback => {
      return (req, callback) => {
        // Returns undefined
        console.log({ origin: req.headers.origin });
        const corsOptions = {
          // This is NOT recommended for production as it enables reflection exploits
          origin: true,
        };

        /**
         * Example has a type error showing req.headers.origin can be undefined, which it always is
         * hence the added pre-check to stop the typescript compiler throwing
         */
        // do not include CORS headers for requests from localhost
        if (req.headers.origin && /^localhost$/m.test(req.headers.origin)) {
          corsOptions.origin = false;
        }

        // callback expects two parameters: error and options
        callback(null, corsOptions);
      };
    }
  );

  app.get("/test", async () => "hello cors");
  return app;
}

export default createServer;
