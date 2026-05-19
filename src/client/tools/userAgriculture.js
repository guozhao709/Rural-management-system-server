import { systemPrompt } from "./userStorage.js";
import { normalizeCropName } from "./userAgrDic.js";
import db from "../db/index.js";
import OpenAI from "openai";

// 先模拟数据,, 后续通过admin上传至数据库
const localEnvironment = {
  region: "陕西省西安市长安区",
  soilType: "黄土土壤",
  averageTemperature: "13℃",
  annualRainfall: "650mm",
  sunlight: "光照充足",
  irrigationCondition: "灌溉条件良好",
  commonRisks: ["春旱", "低温冻害", "蚜虫"],
  suitableCrops: ["小麦", "玉米", "番茄"],
};
const weatherData = {
  location: "西安",
  currentTemperature: "21℃",
  humidity: "63%",
  windSpeed: "12km/h",
  condition: "晴",
  forecast: [
    {
      day: "今天",
      weather: "晴",
      temperature: "21℃ ~ 27℃",
    },
    {
      day: "明天",
      weather: "多云",
      temperature: "19℃ ~ 25℃",
    },
    {
      day: "后天",
      weather: "小雨",
      temperature: "17℃ ~ 22℃",
    },
  ],
  agricultureImpact:
    "未来两天温度适宜，有利于小麦返青和分蘖，但后续降雨可能增加田间湿度。",
};
const marketData = {
  crop: "小麦",
  currentPrice: "2.82元/kg",
  priceTrend: "平稳上涨",
  marketDemand: "较高",
  nearbyPurchasers: ["西安粮食收购站", "长安区农业合作社", "陕西粮贸有限公司"],
  recentAnalysis: "近期面粉加工企业采购需求增加，小麦市场价格略有上涨。",
};

const kimiKey = process.env.KIMI_API_KEY;
if (!kimiKey) {
  throw new Error(
    "Missing KIMI_API_KEY. Please set KIMI_API_KEY in the root .env file.",
  );
}

const prompt = systemPrompt();

const client = new OpenAI({
  apiKey: kimiKey,
  baseURL: "https://api.moonshot.cn/v1",
});

export const saveCropAnalysis = ({ cropName, region, analysisText }) => {
  const stmt = db.prepare(`
    INSERT INTO crop_analysis (crop_name, region, analysis_text)
    VALUES (?, ?, ?)
    ON CONFLICT(crop_name, region) DO UPDATE SET
      analysis_text = excluded.analysis_text,
      updated_at = CURRENT_TIMESTAMP
  `);

  return stmt.run(cropName, region, analysisText);
};

export const getAgriculture = async (crop) => {

  // 先规范化作物名称, 以便于后续查询和提示
  const cropName = normalizeCropName(crop);

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
作物名称：
${cropName}

本地农业环境：
${JSON.stringify(localEnvironment)}

实时天气：
${JSON.stringify(weatherData)}

市场行情：
${JSON.stringify(marketData)}
      `,
      },
    ],

    temperature: 1,
  });

  const text = completion.choices[0].message.content;

  // 将生成的文本存储到数据库
  saveCropAnalysis({
    cropName: cropName,
    region: localEnvironment.region,
    analysisText: text,
  });

  return {cropName, text};
};
