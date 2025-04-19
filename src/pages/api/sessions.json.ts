/** @format */

import { generateFakeSessions } from "@features/history/helpers";

export async function GET() {
  return new Response(JSON.stringify(generateFakeSessions(Date.now())), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
