import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";

import quizRoute from "./routes/quiz";
import gradeRoute from "./routes/grade";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type"],
    allowMethods: ["GET", "POST", "OPTIONS"],
  })
);

app.route("/api/quiz", quizRoute);
app.route("/api/grade", gradeRoute);

serve({
  fetch: app.fetch,
  port: 3001,
});
