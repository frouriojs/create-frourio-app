import { init } from "$/service/app";
import serverlessExpress from "@vendia/serverless-express";

const app = init();
export const handler = serverlessExpress({ app });
