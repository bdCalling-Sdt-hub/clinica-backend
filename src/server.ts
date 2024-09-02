import config from "./app/config";
import mongoose from "mongoose";
import { Server } from "http";
import app from "./app";
import seedAdmin from "./app/DB";

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    seedAdmin();

    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

process.on("unhandledRejection", () => {
  console.log("unhandledRejection detected server shutting down 😈");

  if (server) {
    server.close(() => process.exit(1));
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log("uncaughtException detected server shutting down 😈");
  process.exit(1);
});
