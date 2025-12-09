import { Hono } from "hono";

const quiz = new Hono();

quiz.get("/", (c) => {
  const questions = [
    {
      id: 1,
      type: "text",
      question: "What is the capital of France?",
      correctText: "paris"
    },
    {
      id: 2,
      type: "radio",
      question: "Which planet is known as the Red Planet?",
      choices: ["Mars", "Venus", "Jupiter"],
      correctIndex: 0
    },
    {
      id: 3,
      type: "checkbox",
      question: "Which of the following are programming languages?",
      choices: ["Python", "HTML", "Java"],
      correctIndexes: [0, 2]
    },
    {
      id: 4,
      type: "radio",
      question: "What is 2 + 2?",
      choices: ["3", "4", "5"],
      correctIndex: 1
    },
    {
      id: 5,
      type: "text",
      question: "What does HTTP stand for?",
      correctText: "hypertext transfer protocol"
    },
    {
      id: 6,
      type: "checkbox",
      question: "Select the fruits:",
      choices: ["Apple", "Car", "Banana"],
      correctIndexes: [0, 2]
    },
  ];

  // Shuffle and return 8-12
  const shuffled = questions.sort(() => Math.random() - 0.5);

  return c.json(shuffled.slice(0, 8));
});

export default quiz;
