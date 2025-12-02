import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, QuizDifficulty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateTimeQuiz = async (difficulty: QuizDifficulty = 'easy'): Promise<QuizQuestion> => {
  try {
    const model = "gemini-2.5-flash";
    
    let promptCondition = "";
    if (difficulty === 'easy') {
      promptCondition = "题目难度为小学一年级简单水平。时间最好是整点或半点（例如 3:00, 4:30）。避免复杂的分钟数。";
    } else {
      promptCondition = "题目难度为进阶水平。请生成精确到分钟的时间（例如 14:37, 9:12），并可以使用24小时制描述或跨天的时间概念（如晚上11点）。";
    }

    const prompt = `为小学生生成一个认识时钟的数学题目。${promptCondition} 返回目标时间和题目描述。请用中文。`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: {
              type: Type.STRING,
              description: "给学生看的题目描述，有趣一点。",
            },
            targetHour: {
              type: Type.INTEGER,
              description: "目标时间的24小时制小时数 (0-23)",
            },
            targetMinute: {
              type: Type.INTEGER,
              description: "目标时间的分钟数 (0-59)",
            },
            hint: {
              type: Type.STRING,
              description: "如果学生答错了，给出的简单提示",
            },
          },
          required: ["question", "targetHour", "targetMinute", "hint"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion;
    }
    
    throw new Error("No response from AI");
  } catch (error) {
    console.error("Error generating quiz:", error);
    // Fallback question if API fails or key is missing
    return {
      question: "请将时钟拨到 09:00 (API不可用，使用默认题目)",
      targetHour: 9,
      targetMinute: 0,
      hint: "时针指向9，分针指向12"
    };
  }
};
