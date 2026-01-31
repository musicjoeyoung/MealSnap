export interface Env {
  AI: { run: (model: string, input: Record<string, unknown>) => Promise<any> };
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

type AnalysisResult = {
  mealTitle: string;
  notes: string;
  aiDerived: boolean;
  items: Array<{
    name: string;
    portion: string;
    macros: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
    ingredients: Array<{ name: string; amount: number; unit: string }>;
    confidence?: { low: number; high: number } | null;
  }>;
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    if (url.pathname !== '/analyze') {
      return new Response('Not found', { status: 404 });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const body = await request.json<{
      imageBase64?: string;
      imageMimeType?: string;
      models?: {
        vision?: string;
        reasoning?: string;
      };
    }>();

    if (!body?.imageBase64) {
      return json({ error: 'imageBase64 is required' }, 400);
    }

    const visionModel = body.models?.vision ?? '@cf/llava-hf/llava-1.5-7b-hf';
    const reasoningModel = body.models?.reasoning ?? '@cf/meta/llama-3.1-8b-instruct';

    const visionPrompt = `Describe the foods and portions visible in the photo. Include likely ingredients and preparation style. Be concise.`;

    const visionResult = await env.AI.run(visionModel, {
      image: body.imageBase64,
      prompt: visionPrompt,
    });

    const visionText = String(visionResult?.response ?? visionResult ?? '');
    const reasoningPrompt = `You are estimating meal nutrition from a description.\n\nDescription:\n"""${visionText}"""\n\nReturn ONLY valid JSON with this shape:\n{\n  "mealTitle": string,\n  "notes": string,\n  "aiDerived": true,\n  "items": [\n    {\n      "name": string,\n      "portion": string,\n      "macros": { "calories": number, "protein": number, "carbs": number, "fat": number },\n      "ingredients": [ { "name": string, "amount": number, "unit": string } ],\n      "confidence": { "low": number, "high": number }\n    }\n  ]\n}\n\nNotes should mention values are estimated. Confidence range is between 0 and 1. Use approximate values when uncertain.`;

    const reasoningResult = await env.AI.run(reasoningModel, { prompt: reasoningPrompt });
    const rawText = String(reasoningResult?.response ?? reasoningResult ?? '');
    const parsed = parseJson<AnalysisResult>(rawText) ?? parseJson<AnalysisResult>(visionText);

    if (!parsed) {
      return json(
        {
          mealTitle: 'Meal',
          notes: 'Estimated values',
          aiDerived: true,
          items: [],
        },
        200
      );
    }

    return json({ ...parsed, aiDerived: true }, 200);
  },
};

const parseJson = <T,>(input: string): T | null => {
  try {
    return JSON.parse(input) as T;
  } catch {
    const start = input.indexOf('{');
    const end = input.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) {
      return null;
    }
    try {
      return JSON.parse(input.slice(start, end + 1)) as T;
    } catch {
      return null;
    }
  }
};

const json = (data: unknown, status: number) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
