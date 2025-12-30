import { PrismaClient } from '@prisma/client'
import { cloudinary } from '../src/lib/cloudinary'
import { slugify } from '../src/helpers/slugify'
const prisma = new PrismaClient()


const posts = [
  {
    "title": "Getting Started with TypeScript",
    "description": "A beginner's guide to TypeScript and its features.",
    "summary": "Learn TypeScript basics and setup.",
    "tags": ["typescript", "javascript", "beginner"],
    "readTime": 6,
    "status": "PUBLISHED" as const
  },
  {
    "title": "Understanding Async/Await in Node.js",
    "description": "Deep dive into asynchronous programming with async/await.",
    "summary": "Master async/await for cleaner Node.js code.",
    "tags": ["nodejs", "async", "javascript"],
    "readTime": 7,
    "status": "PUBLISHED" as const
  },
  {
    "title": "REST vs GraphQL: Which to Choose?",
    "description": "A comparison of REST APIs and GraphQL for modern web development.",
    "summary": "REST or GraphQL? Find out which suits your project.",
    "tags": ["api", "graphql", "rest"],
    "readTime": 5,
    "status": "DRAFT" as const
  },
  {
    "title": "Deploying Node.js Apps on Heroku",
    "description": "Step-by-step guide to deploying your Node.js application on Heroku.",
    "summary": "Easily deploy Node.js apps to the cloud.",
    "tags": ["deployment", "heroku", "nodejs"],
    "readTime": 4,
    "status": "PUBLISHED" as const
  },
  {
    "title": "Building a Blog with Express and MongoDB",
    "description": "Create a full-featured blog using Express.js and MongoDB.",
    "summary": "Build a blog backend with Express and MongoDB.",
    "tags": ["express", "mongodb", "blog"],
    "readTime": 8,
    "status": "PUBLISHED" as const
  },
  {
    "title": "Authentication Strategies in Modern Web Apps",
    "description": "Explore various authentication methods for web applications.",
    "summary": "JWT, OAuth, and more for secure apps.",
    "tags": ["authentication", "security", "web"],
    "readTime": 6,
    "status": "PUBLISHED" as const
  },
  {
    "title": "A Guide to Responsive Web Design",
    "description": "Learn the principles and techniques of responsive web design.",
    "summary": "Make your websites look great on any device.",
    "tags": ["css", "responsive", "webdesign"],
    "readTime": 5,
    "status": "DRAFT" as const
  },
  {
    "title": "Optimizing MongoDB Performance",
    "description": "Tips and tricks to improve MongoDB query performance.",
    "summary": "Speed up your MongoDB database.",
    "tags": ["mongodb", "performance", "database"],
    "readTime": 7,
    "status": "PUBLISHED" as const
  },
  {
    "title": "Unit Testing in JavaScript with Jest",
    "description": "How to write and run unit tests using Jest.",
    "summary": "Test your JavaScript code with confidence.",
    "tags": ["testing", "jest", "javascript"],
    "readTime": 4,
    "status": "PUBLISHED" as const
  },
  {
    "title": "Mastering Git for Collaboration",
    "description": "Essential Git commands and workflows for team collaboration.",
    "summary": "Collaborate better with Git.",
    "tags": ["git", "collaboration", "workflow"],
    "readTime": 6,
    "status": "PUBLISHED" as const
  }
]



const main = async () => {
    await prisma.post.deleteMany()
    await cloudinary.api.delete_resources_by_prefix('cover-images');

    const result = await prisma.post.createMany({
        data: posts.map(post => ({
            ...post, authorId: '69515e0d56ec4c8f14b59a17',
            slug: slugify(post.title)
        }))
    })

    console.log(`Seeded Result: `, result)
}

main()