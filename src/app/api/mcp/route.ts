import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { createMcpServer } from '@/lib/mcp/server'
import { resolveApiKey } from '@/lib/mcp/auth'

export async function POST(request: Request) {
  const userId = await resolveApiKey(request.headers.get('authorization'))
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const server = createMcpServer(userId)
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined })
  await server.connect(transport)
  return await transport.handleRequest(request)
}
