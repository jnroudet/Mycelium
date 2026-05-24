import Anthropic from 'npm:@anthropic-ai/sdk'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const { noteContent, candidates } = await req.json()

  if (!noteContent?.trim() || !candidates?.length) {
    return new Response(JSON.stringify({ links: [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') })

  const candidateList = candidates
    .slice(0, 20)
    .map((c) => `[${c.id}] ${c.content.slice(0, 200)}`)
    .join('\n---\n')

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `Tu es un assistant de gestion de connaissances personnelles.
Analyse la note principale et identifie parmi les candidates celles qui sont véritablement liées : même thème, idées complémentaires, ou qui s'éclairent mutuellement. Sois sélectif — 0 à 3 liens maximum.

Note principale :
"${noteContent}"

Notes candidates :
${candidateList}

Réponds UNIQUEMENT avec du JSON valide, sans markdown :
{"links": [{"id": "...", "reason": "..."}]}

Si aucun lien pertinent, réponds : {"links": []}`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const result = JSON.parse(text)
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch {
    return new Response(JSON.stringify({ links: [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
