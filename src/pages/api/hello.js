// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"
import { executeQuery } from "../../../lib/db"

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).json({ error: "Not authenticated" })
    return
  } else {
    console.log(session)

    const result = await executeQuery({
      query: 'SELECT * FROM users',
      value: []
    });
    console.log(result[4])
    res.status(200).json({ result: result})
  }
}
