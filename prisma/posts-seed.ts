import { PrismaClient } from '@prisma/client'
import { cloudinary } from '../src/lib/cloudinary'
import { slugify } from '../src/helpers/slugify'
const prisma = new PrismaClient()


const posts =[
  {
    title: "Getting Started with TypeScript",
    description: "A beginner's guide to TypeScript and its features.",
    summary: "Learn TypeScript basics and setup.",
    tags: ["typescript", "javascript", "beginner"],
    readTime: 6,
    status: "PUBLISHED" as const
  },
  {
    title: "Understanding Async/Await in Node.js",
    description: "Deep dive into asynchronous programming with async/await.",
    summary: "Master async/await for cleaner Node.js code.",
    tags: ["nodejs", "async", "javascript"],
    readTime: 7,
    status: "PUBLISHED" as const
  },
  {
    title: "REST vs GraphQL: Which to Choose?",
    description: "A comparison of REST APIs and GraphQL for modern web development.",
    summary: "REST or GraphQL? Find out which suits your project.",
    tags: ["api", "graphql", "rest"],
    readTime: 5,
    status: "DRAFT" as const
  },
  {
    title: "Deploying Node.js Apps on Heroku",
    description: "Step-by-step guide to deploying your Node.js application on Heroku.",
    summary: "Easily deploy Node.js apps to the cloud.",
    tags: ["deployment", "heroku", "nodejs"],
    readTime: 4,
    status: "PUBLISHED" as const
  },
  {
    title: "Building a Blog with Express and MongoDB",
    description: "Create a full-featured blog using Express.js and MongoDB.",
    summary: "Build a blog backend with Express and MongoDB.",
    tags: ["express", "mongodb", "blog"],
    readTime: 8,
    status: "PUBLISHED" as const
  },
  {
    title: "Authentication Strategies in Modern Web Apps",
    description: "Explore various authentication methods for web applications.",
    summary: "JWT, OAuth, and more for secure apps.",
    tags: ["authentication", "security", "web"],
    readTime: 6,
    status: "PUBLISHED" as const
  },
  {
    title: "A Guide to Responsive Web Design",
    description: "Learn the principles and techniques of responsive web design.",
    summary: "Make your websites look great on any device.",
    tags: ["css", "responsive", "webdesign"],
    readTime: 5,
    status: "DRAFT" as const
  },
  {
    title: "Optimizing MongoDB Performance",
    description: "Tips and tricks to improve MongoDB query performance.",
    summary: "Speed up your MongoDB database.",
    tags: ["mongodb", "performance", "database"],
    readTime: 7,
    status: "PUBLISHED" as const
  },
  {
    title: "Unit Testing in JavaScript with Jest",
    description: "How to write and run unit tests using Jest.",
    summary: "Test your JavaScript code with confidence.",
    tags: ["testing", "jest", "javascript"],
    readTime: 4,
    status: "PUBLISHED" as const
  },
  {
    title: "Mastering Git for Collaboration",
    description: "Essential Git commands and workflows for team collaboration.",
    summary: "Collaborate better with Git.",
    tags: ["git", "collaboration", "workflow"],
    readTime: 6,
    status: "PUBLISHED" as const
  },
  {
    title: "Introduction to RESTful APIs",
    description: "Learn the basics of RESTful API design and implementation.",
    summary: "Build scalable APIs with REST.",
    tags: ["api", "rest", "backend"],
    readTime: 5,
    status: "PUBLISHED" as const
  },
  {
    title: "Building Real-Time Apps with Socket.io",
    description: "Implement real-time features using Socket.io in Node.js.",
    summary: "Add real-time communication to your apps.",
    tags: ["socket.io", "realtime", "nodejs"],
    readTime: 7,
    status: "PUBLISHED" as const
  },
  {
    title: "Introduction to Docker for Developers",
    description: "Containerize your applications using Docker.",
    summary: "Get started with Docker for development.",
    tags: ["docker", "devops", "containers"],
    readTime: 6,
    status: "PUBLISHED" as const
  },
  {
    title: "Securing Express Apps with Helmet",
    description: "Use Helmet middleware to secure your Express applications.",
    summary: "Protect your Express apps from vulnerabilities.",
    tags: ["express", "security", "helmet"],
    readTime: 4,
    status: "PUBLISHED" as const
  },
  {
    title: "Introduction to TypeORM with TypeScript",
    description: "Use TypeORM for database management in TypeScript projects.",
    summary: "Manage databases with TypeORM.",
    tags: ["typeorm", "typescript", "database"],
    readTime: 7,
    status: "PUBLISHED" as const
  },
  {
    title: "Building REST APIs with Fastify",
    description: "Create fast and efficient REST APIs using Fastify.",
    summary: "Boost API performance with Fastify.",
    tags: ["fastify", "api", "nodejs"],
    readTime: 5,
    status: "PUBLISHED" as const
  },
  {
    title: "Introduction to Next.js",
    description: "Build server-side rendered React apps with Next.js.",
    summary: "Get started with Next.js for SSR.",
    tags: ["nextjs", "react", "ssr"],
    readTime: 6,
    status: "PUBLISHED" as const
  },
  {
    title: "Using Prisma with MongoDB",
    description: "Integrate Prisma ORM with MongoDB for scalable apps.",
    summary: "Leverage Prisma for MongoDB projects.",
    tags: ["prisma", "mongodb", "orm"],
    readTime: 7,
    status: "PUBLISHED" as const
  },
  {
    title: "Building REST APIs with Express",
    description: "Step-by-step guide to building REST APIs using Express.js.",
    summary: "Create robust APIs with Express.",
    tags: ["express", "api", "nodejs"],
    readTime: 5,
    status: "PUBLISHED" as const
  },
  {
    title: "Introduction to Zod for Validation",
    description: "Validate your data using Zod in TypeScript projects.",
    summary: "Type-safe validation with Zod.",
    tags: ["zod", "typescript", "validation"],
    readTime: 4,
    status: "PUBLISHED" as const
  },
  {
    title: "Building a Simple Blog with React",
    description: "Create a blog frontend using React.",
    summary: "Build interactive UIs with React.",
    tags: ["react", "blog", "frontend"],
    readTime: 6,
    status: "PUBLISHED" as const
  },
  {
    title: "Introduction to Redux Toolkit",
    description: "Manage state efficiently in React apps with Redux Toolkit.",
    summary: "Simplify state management with Redux Toolkit.",
    tags: ["redux", "react", "state"],
    readTime: 7,
    status: "PUBLISHED" as const
  },
  {
    title: "Building REST APIs with Koa",
    description: "Create RESTful APIs using Koa.js.",
    summary: "Lightweight API development with Koa.",
    tags: ["koa", "api", "nodejs"],
    readTime: 5,
    status: "PUBLISHED" as const
  },
  {
    title: "Introduction to Mongoose ODM",
    description: "Use Mongoose for MongoDB object modeling in Node.js.",
    summary: "Model MongoDB data with Mongoose.",
    tags: ["mongoose", "mongodb", "nodejs"],
    readTime: 6,
    status: "PUBLISHED" as const
  },
  {
    title: "Building REST APIs with Hapi.js",
    description: "Develop RESTful APIs using Hapi.js framework.",
    summary: "Robust API development with Hapi.js.",
    tags: ["hapi", "api", "nodejs"],
    readTime: 7,
    status: "PUBLISHED" as const
  },
  {
    title: "Introduction to JWT Authentication",
    description: "Implement JWT authentication in your web apps.",
    summary: "Secure your apps with JWT.",
    tags: ["jwt", "authentication", "security"],
    readTime: 5,
    status: "PUBLISHED" as const
  },
  {
    title: "Building REST APIs with NestJS",
    description: "Create scalable REST APIs using NestJS.",
    summary: "Enterprise-grade APIs with NestJS.",
    tags: ["nestjs", "api", "nodejs"],
    readTime: 6,
    status: "PUBLISHED" as const
  },
  {
    title: "Introduction to GraphQL",
    description: "Learn the basics of GraphQL and how to use it.",
    summary: "Query your data efficiently with GraphQL.",
    tags: ["graphql", "api", "query"],
    readTime: 7,
    status: "PUBLISHED" as const
  },
  {
    title: "Building REST APIs with Sails.js",
    description: "Develop RESTful APIs using Sails.js framework.",
    summary: "MVC API development with Sails.js.",
    tags: ["sails", "api", "nodejs"],
    readTime: 5,
    status: "PUBLISHED" as const
  },
  {
    title: "Introduction to Passport.js",
    description: "Implement authentication using Passport.js.",
    summary: "Flexible authentication with Passport.js.",
    tags: ["passport", "authentication", "nodejs"],
    readTime: 6,
    status: "PUBLISHED" as const
  },
  {
    title: "Building REST APIs with AdonisJS",
    description: "Create RESTful APIs using AdonisJS framework.",
    summary: "Full-featured API development with AdonisJS.",
    tags: ["adonisjs", "api", "nodejs"],
    readTime: 7,
    status: "PUBLISHED" as const
  },
  {
    title: "Introduction to WebSockets",
    description: "Add real-time communication to your apps with WebSockets.",
    summary: "Enable real-time features with WebSockets.",
    tags: ["websockets", "realtime", "nodejs"],
    readTime: 5,
    status: "PUBLISHED" as const
  },
  {
    title: "Building REST APIs with FeathersJS",
    description: "Develop RESTful APIs using FeathersJS.",
    summary: "Service-oriented API development with FeathersJS.",
    tags: ["feathersjs", "api", "nodejs"],
    readTime: 6,
    status: "PUBLISHED" as const
  },
  {
    title: "Introduction to OAuth 2.0",
    description: "Implement OAuth 2.0 authentication in your apps.",
    summary: "Secure authentication with OAuth 2.0.",
    tags: ["oauth", "authentication", "security"],
    readTime: 7,
    status: "PUBLISHED" as const
  },
  {
    title: "Building REST APIs with LoopBack",
    description: "Create RESTful APIs using LoopBack framework.",
    summary: "API development with LoopBack.",
    tags: ["loopback", "api", "nodejs"],
    readTime: 5,
    status: "PUBLISHED" as const
  },
  {
    title: "Introduction to Microservices Architecture",
    description: "Design scalable apps using microservices architecture.",
    summary: "Break down your app into microservices.",
    tags: ["microservices", "architecture", "scalability"],
    readTime: 6,
    status: "PUBLISHED" as const
  },
  {
    title: "Building REST APIs with Total.js",
    description: "Develop RESTful APIs using Total.js framework.",
    summary: "Rapid API development with Total.js.",
    tags: ["totaljs", "api", "nodejs"],
    readTime: 7,
    status: "PUBLISHED" as const
  },
  {
    title: "Introduction to Serverless Functions",
    description: "Deploy serverless functions using AWS Lambda.",
    summary: "Go serverless with AWS Lambda.",
    tags: ["serverless", "aws", "lambda"],
    readTime: 5,
    status: "PUBLISHED" as const
  },
  {
    title: "Building REST APIs with ActionHero",
    description: "Create RESTful APIs using ActionHero framework.",
    summary: "Scalable API development with ActionHero.",
    tags: ["actionhero", "api", "nodejs"],
    readTime: 6,
    status: "PUBLISHED" as const
  },
  {
    title: "Introduction to REST API Testing",
    description: "Test your REST APIs using Postman and Jest.",
    summary: "Ensure API quality with testing.",
    tags: ["testing", "api", "postman"],
    readTime: 7,
    status: "PUBLISHED" as const
  },
  {
    title: "Building REST APIs with Restify",
    description: "Develop RESTful APIs using Restify framework.",
    summary: "Efficient API development with Restify.",
    tags: ["restify", "api", "nodejs"],
    readTime: 5,
    status: "PUBLISHED" as const
  },
  {
    title: "Introduction to API Rate Limiting",
    description: "Implement rate limiting in your APIs.",
    summary: "Protect your APIs with rate limiting.",
    tags: ["rate-limiting", "api", "security"],
    readTime: 6,
    status: "PUBLISHED" as const
  },
  {
    title: "Building REST APIs with Moleculer",
    description: "Create RESTful APIs using Moleculer microservices framework.",
    summary: "Microservices API development with Moleculer.",
    tags: ["moleculer", "api", "microservices"],
    readTime: 7,
    status: "PUBLISHED" as const
  },
  {
    title: "Introduction to API Documentation",
    description: "Document your APIs using Swagger and OpenAPI.",
    summary: "Create clear API docs with Swagger.",
    tags: ["swagger", "openapi", "documentation"],
    readTime: 5,
    status: "PUBLISHED" as const
  },
  {
    title: "Building REST APIs with RedwoodJS",
    description: "Develop RESTful APIs using RedwoodJS framework.",
    summary: "Full-stack API development with RedwoodJS.",
    tags: ["redwoodjs", "api", "nodejs"],
    readTime: 6,
    status: "PUBLISHED" as const
  },
  {
    title: "Introduction to API Caching",
    description: "Improve API performance with caching strategies.",
    summary: "Speed up your APIs with caching.",
    tags: ["caching", "api", "performance"],
    readTime: 7,
    status: "PUBLISHED" as const
  },
  {
    title: "Building REST APIs with Blitz.js",
    description: "Create RESTful APIs using Blitz.js framework.",
    summary: "Rapid API development with Blitz.js.",
    tags: ["blitzjs", "api", "nodejs"],
    readTime: 5,
    status: "PUBLISHED" as const
  },
  {
    title: "Introduction to API Monitoring",
    description: "Monitor your APIs using tools like New Relic.",
    summary: "Keep your APIs healthy with monitoring.",
    tags: ["monitoring", "api", "newrelic"],
    readTime: 6,
    status: "PUBLISHED" as const
  },
  {
    title: "Building REST APIs with FoalTS",
    description: "Develop RESTful APIs using FoalTS framework.",
    summary: "TypeScript API development with FoalTS.",
    tags: ["foalts", "api", "typescript"],
    readTime: 7,
    status: "PUBLISHED" as const
  },
  {
    title: "Introduction to API Versioning",
    description: "Manage multiple API versions in your projects.",
    summary: "Handle API changes with versioning.",
    tags: ["versioning", "api", "management"],
    readTime: 5,
    status: "PUBLISHED" as const
  }
]


const main = async () => {
  await cloudinary.api.delete_resources_by_prefix('cover-images');
  // await prisma.comment.deleteMany()
  // await prisma.bookmark.deleteMany()
  await prisma.post.deleteMany()

    const result = await prisma.post.createMany({
        data: posts.map(post => ({
            ...post, authorId: '69515e0d56ec4c8f14b59a17',
            slug: slugify(post.title)
        }))
    })

    console.log(`Seeded Result: `, result)
}

main()