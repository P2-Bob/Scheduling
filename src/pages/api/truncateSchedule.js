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

    await executeQuery({
      query: 'TRUNCATE TABLE schedule',
      value: []
    });
    
    res.status(200).json({ result: "success yeah :)"})
  }
}
