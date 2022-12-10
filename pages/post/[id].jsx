import { useEffect, useState } from 'react'
import { useRouter  } from 'next/router'
import { useSession, signIn, signOut } from "next-auth/react"
import Image from 'next/image'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import SiteNavigation from '../../components/SiteNavigation'
import Pixels from '../../components/Pixels'

export default function PostPage({ post }) {
  const { data: session } = useSession()

  return (
    <>
      <div className='h-screen'>
        <SiteNavigation />

        <div className="flex items-center m-auto my-8 w-1/3">
          <div className="min-w-2xl">
            {post.user?.image &&
              <Image
                className="h-12 w-12 rounded-full"
                src={post.user.image}
                width={50}
                height={50}
                alt=""
              />
            }
          </div>

          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium ">
                {'User: ' + post.user?.name}
              </p>
              <p className="pl-5 text-sm ">{'Created at: ' + post.createdAt}</p>
            </div>
            <div className="flex-1 mt-1">
              <p className="text-xl font-semibold ">
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col max-h-screen items-center h-2/3 my-6">
          <Pixels pixelColors={post.pixels} />
        </div>
      </div>
    </>
  )
}

export async function getStaticPaths() {
  const posts = await prisma.post.findMany({})
  const paths = posts.map((post) => ({ params: { id: post.id.toString() } }))
  return { paths, fallback: false }
}

export async function getStaticProps(context) {
  const id = parseInt(context.params.id)
  const post = await prisma.post.findUnique({
    where: {
      id: id
    },
    include: {
      user: true,
    },
  })

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
    },
  }
}