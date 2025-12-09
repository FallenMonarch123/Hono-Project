import { Hono } from "hono";
import { z } from "zod";

const grade = new Hono();

// Zod schema for validation
const AnswerSchema = z.object({
  id: z.number(),
  value: z.union([z.string(), z.number(), z.array(z.number())])
});

const PayloadSchema = z.object({
  answers: z.array(AnswerSchema)
});

// Same question set used in /quiz
const questions = [
  { id: 1, correctText: "paris" },
  { id: 2, correctIndex: 0 },
  { id: 3, correctIndexes: [0, 2] },
  { id: 4, correctIndex: 1 },
  { id: 5, correctText: "hypertext transfer protocol" },
  { id: 6, correctIndexes: [0, 2] }
];

grade.post("/", async (c) => {
  const body = await c.req.json().catch(() => null);

  if (!body) {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  const parsed = PayloadSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid payload" }, 400);
  }

  let score = 0;
  const results = [];

  for (const ans of body.answers) {
    const q = questions.find((x) => x.id === ans.id);
    if (!q) {
      results.push({ id: ans.id, correct: false });
      continue;
    }

    let correct = false;

    // TEXT QUESTION
    if ("correctText" in q) {
      const user = String(ans.value).trim().toLowerCase();
      const correctText = q.correctText.trim().toLowerCase();
      correct = user === correctText;
    }

    // SINGLE CHOICE
    if ("correctIndex" in q) {
      correct = ans.value === q.correctIndex;
    }

    // MULTIPLE CHOICE
    if ("correctIndexes" in q) {
      const userArr = Array.isArray(ans.value) ? ans.value.sort() : [];
      const correctArr = q.correctIndexes.sort();

      correct =
        JSON.stringify(userArr) === JSON.stringify(correctArr);
    }

    if (correct) score++;

    results.push({ id: q.id, correct });
  }

  return c.json({
    score,
    total: questions.length,
    results
  });
});

export default grade;
