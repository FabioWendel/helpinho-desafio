import serverless from "aws-serverless-express";
import app from "./app";

const server = serverless.createServer(app);

export const handler = (event: any, context: any) => {
  return serverless.proxy(server, event, context);
};
