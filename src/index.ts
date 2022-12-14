import createServer from "./server";

const main = async () => {
  const PORT = process.env.PORT || 3000;
  const server = await createServer();

  try {
    server.listen({
      host: process.env.HOST || "0.0.0.0",
      port: Number(PORT),
    });
    server.log.info(`Server is now listening on PORT ${PORT}`);
  } catch (error) {
    server.log.error(error);
    throw error;
  }
};

main();
