const axios = require('axios');

/**
 * AI Veterinary Triage Service using Google Gemini 3.8 Flash
 * Novel Feature: Automated Visual Injury Detection & Emergency Priority Scoring
 */
async function analyzeRescueImage(imageData) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in backend environment.');
  }

  let mimeType = 'image/jpeg';
  let base64Data = '';

  if (typeof imageData === 'string') {
    if (imageData.startsWith('data:')) {
      const match = imageData.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      }
    } else if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
      // Fetch remote image and convert to base64
      const response = await axios.get(imageData, { responseType: 'arraybuffer' });
      mimeType = response.headers['content-type'] || 'image/jpeg';
      base64Data = Buffer.from(response.data).toString('base64');
    } else {
      // Raw base64 string
      base64Data = imageData;
    }
  } else if (Buffer.isBuffer(imageData)) {
    base64Data = imageData.toString('base64');
  }

  if (!base64Data) {
    throw new Error('Invalid or empty image data provided for AI triage.');
  }

  const prompt = `You are an expert Veterinary Emergency & Wildlife Rescue Triage AI.
Analyze the provided image of an animal reported in distress.
Evaluate visual signs of injury, physical condition, and species characteristics to generate a structured emergency triage assessment.

You MUST respond strictly with a valid JSON object matching this schema:
{
  "isAnimalDetected": true, // boolean
  "species": "Dog / Cat / Cow / Bird / Other", // identified species
  "breedEstimation": "e.g., Indian Pariah / Indie / Stray or breed name",
  "injuryDetected": true, // boolean
  "injuryType": "e.g., Fracture / Open Wound / Skin Infection / Malnutrition / Trauma / None",
  "severity": "Critical" | "High" | "Medium" | "Low" | "None",
  "triageScore": 85, // integer 1 to 100 representing emergency priority score (100 = immediate life threat, 1 = healthy/minimal)
  "urgencyWindow": "Immediate (< 30 mins)" | "Urgent (1-2 hours)" | "Same day (< 6 hours)" | "Non-urgent",
  "suggestedTitle": "Short, clear title for rescue report (e.g., Injured indie dog with severe leg trauma)",
  "suggestedDescription": "2-3 concise sentences describing condition, symptoms, and observed hazards",
  "suggestedFirstAid": "Clear, bulletproof instructions for reporter/bystander while rescue team is en route (e.g. Keep warm, do not force food, stabilize limb)",
  "clinicalNotes": "Key visual diagnostic signs observed from image",
  "recommendedDonationGoal": 1500 // estimated emergency medical fund in INR (e.g., 500, 1500, 3000, 5000)
}

Important Rules:
- If NO animal is visible or the image is non-animal content, set "isAnimalDetected": false, "injuryDetected": false, "severity": "None", "triageScore": 0, "species": "Not detected", "suggestedTitle": "No animal detected", "suggestedDescription": "Please upload a clear photograph of the animal.", "suggestedFirstAid": "N/A", "clinicalNotes": "No animal observed in image."
- Be compassionate, objective, and realistic in severity ratings.`;

  const payload = {
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: prompt
          }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2
    }
  };

  const candidateModels = [
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
    'gemini-3.5-flash',
    'gemini-3.8-flash'
  ];

  let lastError = null;

  for (const model of candidateModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await axios.post(endpoint, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 25000
      });

      const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (responseText) {
        const parsed = JSON.parse(responseText);
        parsed.analyzedAt = new Date().toISOString();
        parsed.modelUsed = model;
        return parsed;
      }
    } catch (err) {
      lastError = err;
      console.warn(`Model ${model} triage attempt failed (${err.response?.status || err.message}), trying fallback...`);
    }
  }

  throw new Error('All AI triage models failed: ' + (lastError?.response?.data?.error?.message || lastError?.message));
}

module.exports = {
  analyzeRescueImage
};
