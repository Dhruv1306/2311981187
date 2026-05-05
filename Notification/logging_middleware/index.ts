type Stack = "backend" | "frontend"
type Level = "debug" | "info" | "warn" | "error" | "fatal"
type Package =
  | "cache" | "controller" | "cron_job" | "db" | "domain"
  | "handler" | "repository" | "route" | "service"
  | "api" | "component" | "hook" | "page" | "state" | "style"
  | "auth" | "config" | "middleware" | "utils"

const BASE_URL = "http://20.207.122.201/evaluation-service"

const credentials = {
  email: "dhruv1187.be23@chitkarauniversity.edu.in",
  name: "Dhruv Dalal",
  rollNo: "2311981187",
  accessCode: "EXfvDp",
  clientID: "04142122-3dff-48fa-861d-c8463aeee15e",
  clientSecret: "hKGaQXMuptuNZwuh",
}

let cachedToken: string | null = null
let tokenExpiry: number = 0

async function refreshToken(): Promise<string> {
  const res = await fetch(`${BASE_URL}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  })
  const data = await res.json()
  cachedToken = data.access_token
  tokenExpiry = data.expires_in
  return cachedToken!
}

export async function getAuthToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  if (cachedToken && now < tokenExpiry - 60) return cachedToken
  return refreshToken()
}

export async function Log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
): Promise<void> {
  try {
    const token = await getAuthToken()
    await fetch(`${BASE_URL}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    })
  } catch (_) {}
}
