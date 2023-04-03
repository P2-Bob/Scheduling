// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).json({ error: "Not authenticated" })
    return
  } else {
    console.log(session)
    res.status(200).json({ result: "Hej med dig du har adgang :)", username: session.user.name })
  }
}
