// RESEARCH: copy literal vercel/chatbot Apache-2.0 (lib/ratelimit.ts) + adapt import paths (Sprint 1.3 E.3a)
// D-S1.3-04 cravado: redis@^5 TCP compativel Upstash via TLS (REDIS_URL).
// @upstash/ratelimit ja instalado (pra MCP Sprint 3) — pode coexistir.

import 'server-only'

import { createClient } from 'redis'

import { ChatbotError } from '@/lib/errors/chatbot'
import { isProductionEnvironment } from '@/lib/utils/chat-constants'

const MAX_MESSAGES = 10
const TTL_SECONDS = 60 * 60

let client: ReturnType<typeof createClient> | null = null

function getClient() {
  if (!client && process.env.REDIS_URL) {
    client = createClient({ url: process.env.REDIS_URL })
    client.on('error', () => undefined)
    client.connect().catch(() => {
      client = null
    })
  }
  return client
}

export async function checkIpRateLimit(ip: string | undefined) {
  if (!isProductionEnvironment || !ip) {
    return
  }

  const redis = getClient()
  if (!redis?.isReady) {
    return
  }

  try {
    const key = `ip-rate-limit:${ip}`
    const [count] = await redis.multi().incr(key).expire(key, TTL_SECONDS, 'NX').exec()

    if (typeof count === 'number' && count > MAX_MESSAGES) {
      throw new ChatbotError('rate_limit:chat')
    }
  } catch (error) {
    if (error instanceof ChatbotError) {
      throw error
    }
  }
}
