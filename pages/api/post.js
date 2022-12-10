import { authOptions } from './auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { method } = req

  switch (method) {
    case 'GET':
      const posts = await prisma.post.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: true,
          likes: true,
          comments: true
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      res.status(200).json({ success: true, posts: posts })
      break
    case 'POST':
      const session = await unstable_getServerSession(req, res, authOptions)
      if (!session) {
        res.status(401).send('Unauthorized')
        return
      }

      const { pixels } = req.body
      //console.log('received pixelColors:', pixelColors)
      const prismaUser = await prisma.user.findUnique({
        where: {
          email: session.user.email
        }
      })

      if (!prismaUser) {
        res.status(401).send('Unauthorized')
        return
      }

      const post = await prisma.post.create({
        data: {
          pixels,
          userId: prismaUser.id
        },
      })
      res.status(201).json(post)
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}