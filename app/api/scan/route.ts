import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { base64, mediaType } = await req.json()

    if (!base64 || !mediaType) {
      return NextResponse.json({ error: 'Missing image data' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY not set in environment' }, { status: 500 })
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mediaType};base64,${base64}`,
                },
              },
              {
                type: 'text',
                text: `Analyze this nutrition label image and extract the nutritional information. Return ONLY a JSON object (no markdown, no explanation, no backticks) with these exact fields:
{
  "name": "product name or food description",
  "calories": number (per serving),
  "protein": number in grams (per serving),
  "carbs": number in grams (per serving),
  "fat": number in grams (per serving),
  "servingSize": "serving size description e.g. 2 slices 86g",
  "emoji": "single relevant emoji for this food"
}
Always return valid JSON only. No extra text.`,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return NextResponse.json({ error: `OpenAI API error: ${err}` }, { status: 500 })
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || ''

    // Extract JSON robustly
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Could not parse nutrition data from response' }, { status: 500 })
    }

    const nutrition = JSON.parse(jsonMatch[0])
    return NextResponse.json(nutrition)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
