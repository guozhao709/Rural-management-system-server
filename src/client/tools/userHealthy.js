import { healthySystemPrompt } from "./userStorage.js";
import db from "../db/index.js";
import OpenAI from "openai";

const kimiKey = process.env.KIMI_API_KEY;
if (!kimiKey) {
  throw new Error(
    "Missing KIMI_API_KEY. Please set KIMI_API_KEY in the root .env file.",
  );
}

const prompt = healthySystemPrompt();

const client = new OpenAI({
  apiKey: kimiKey,
  baseURL: "https://api.moonshot.cn/v1",
});

const formatInputForPrompt = (value) => {
  if (value === undefined || value === null || value === "") {
    return "{}";
  }

  return typeof value === "string" ? value : JSON.stringify(value);
};

const serializeInput = (value) => {
  if (value === undefined || value === null || value === "") {
    return JSON.stringify({});
  }

  return JSON.stringify(value);
};

const parseModelJson = (text) => {
  const trimmedText = text.trim();

  try {
    return JSON.parse(trimmedText);
  } catch (error) {
    const jsonMatch = trimmedText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw error;
    }

    return JSON.parse(jsonMatch[0]);
  }
};

export const saveHealthAnalysis = ({
  userId,
  basicInfo,
  symptoms,
  habits,
  medicalHistory,
  analysisJson,
}) => {
  const stmt = db.prepare(`
    INSERT INTO health_analysis (
      user_id,
      basic_info,
      symptoms,
      habits,
      medical_history,
      analysis_json
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  return stmt.run(
    userId,
    serializeInput(basicInfo),
    serializeInput(symptoms),
    serializeInput(habits),
    serializeInput(medicalHistory),
    JSON.stringify(analysisJson),
  );
};

export const getHealthy = async ({
  userId = "anonymous",
  basicInfo = {},
  symptoms = {},
  habits = {},
  medicalHistory = {},
}) => {
  const completion = await client.chat.completions.create({
    model: "kimi-k2.6",

    messages: [
      {
        role: "system",
        content: prompt,
      },

      {
        role: "user",
        content: `
基础健康信息：
${formatInputForPrompt(basicInfo)}

当前症状：
${formatInputForPrompt(symptoms)}

生活习惯：
${formatInputForPrompt(habits)}

既往病史：
${formatInputForPrompt(medicalHistory)}
      `,
      },
    ],

    temperature: 1,
  });

  const text = completion.choices[0].message.content;
  const analysis = parseModelJson(text);
  const now = new Date();

  saveHealthAnalysis({
    userId,
    basicInfo,
    symptoms,
    habits,
    medicalHistory,
    analysisJson: analysis,
  });

  return {
    userId,
    analysis,
    analysisTime: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`,
  };
};

export const getLatestHealthAnalysis = (userId) => {
  const row = db
    .prepare(
      `
      SELECT analysis_json, basic_info, symptoms, habits, medical_history, updated_at
      FROM health_analysis
      WHERE user_id = ?
      ORDER BY updated_at DESC, id DESC
      LIMIT 1
      `,
    )
    .get(userId);

  if (!row) {
    return null;
  }

  return {
    basicInfo: JSON.parse(row.basic_info),
    symptoms: JSON.parse(row.symptoms),
    habits: JSON.parse(row.habits),
    medicalHistory: JSON.parse(row.medical_history),
    analysis: JSON.parse(row.analysis_json),
    analysisTime: row.updated_at,
  };
};
