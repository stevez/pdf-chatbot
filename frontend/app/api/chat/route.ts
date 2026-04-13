import { NextResponse } from 'next/server';
import { retrievalAssistantStreamConfig } from '@/constants/graphConfigs';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { message, threadId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!threadId) {
      return NextResponse.json({ error: 'Thread ID is required' }, { status: 400 });
    }

    const assistantId = process.env.LANGGRAPH_RETRIEVAL_ASSISTANT_ID;
    if (!assistantId) {
      return NextResponse.json({ error: 'LANGGRAPH_RETRIEVAL_ASSISTANT_ID is not set' }, { status: 500 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_LANGGRAPH_API_URL;
    if (!apiUrl) {
      return NextResponse.json({ error: 'LANGGRAPH_API_URL is not set' }, { status: 500 });
    }

    const response = await fetch(
      `${apiUrl}/threads/${threadId}/runs/stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': process.env.LANGCHAIN_API_KEY || '',
        },
        body: JSON.stringify({
          assistant_id: assistantId,
          input: { query: message },
          stream_mode: ['messages', 'updates'],
          config: {
            configurable: {
              ...retrievalAssistantStreamConfig,
            },
          },
        }),
      },
    );

    if (!response.ok || !response.body) {
      return NextResponse.json({ error: 'Failed to connect to LangGraph server' }, { status: 502 });
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
