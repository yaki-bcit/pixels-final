import { useEffect, useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import Router, { useRouter } from 'next/router'
import Link from 'next/link'

import SiteNavigation from "../components/SiteNavigation"
import Pixels from '../components/Pixels'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import axios from 'axios'

function createBlankArray(number = 16) {
  return Array(number).fill(0).map(a => (Array(number).fill(0)))
}

export default function Home({ posts }) {
  const { data: session } = useSession()

  const router = useRouter()

  const [pixelColors, setPixelColors] = useState(createBlankArray(16))
  const [userPosts, setUserPosts] = useState(posts)

  const handleSave = async () => {
    const pixels = [... pixelColors]
    const { data } = await axios.post('/api/post', {
      pixels
    })
    const updatedUserPosts = [...userPosts, data]
    setUserPosts(updatedUserPosts)
  }

  return (
    <>
      <div className='h-screen'>
        <SiteNavigation />

        <div className="flex flex-col m-auto w-80">
          {userPosts && userPosts.map((post, index) => {
            return (
              <Link href={`/post/${post.id}`} key={index}>
                <div className="flex h-80 my-10">
                  <Pixels pixelColors={post.pixels} />
                </div>
              </Link>
            )
          })}
        </div>

        <div className='flex flex-col items-center justify-around h-1/6'>
          <h2 className="text-center text-7xl">Create a new drawing</h2>

          <div className='flex'>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-5"
              onClick={async () => {
                // save the matrix 
                // reset the matrix
                handleSave()
                setPixelColors(createBlankArray(16))
              }}
            >
              save
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-5"
              onClick={() => {
                setPixelColors(createBlankArray(16))
              }}
            >
              reset
            </button>
          </div>

        </div>

        <div className="flex flex-col max-h-screen items-center h-2/3">
          <Pixels pixelColors={pixelColors} onPixelClick={(rowIndex, colIndex) => {
            const newPixelColors = [...pixelColors]
            newPixelColors[rowIndex][colIndex] = newPixelColors[rowIndex][colIndex] === 1 ? 0 : 1
            setPixelColors(newPixelColors)
          }} />
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps() {

  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'asc',
    },
  })

  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
    }
  }
}
