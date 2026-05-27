import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/next";

export const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [
    // WAF-style protection against SQLi, XSS etc.
    shield({ mode: "LIVE" }),

    // Block automated bots
    detectBot({
      mode: "LIVE",
      allow: [], // block all bots, including curl
    }),

    // 20 requests per minute per IP
    tokenBucket({
      mode: "LIVE",
      refillRate: 20,
      interval: 60,
      capacity: 20,
    }),
  ],
});