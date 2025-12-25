# Fuse App

A Next.js application with authentication, email verification, and AI-powered features using Google's Generative AI.

## Features

- 🔐 **Authentication**: NextAuth.js with credential-based authentication
- 📧 **Email Verification**: Resend integration for verification emails
- 🤖 **AI Integration**: Google Generative AI for content generation
- 🎨 **Modern UI**: Tailwind CSS with Framer Motion animations
- 🗄️ **Database**: MongoDB with Mongoose ODM
- 📱 **Responsive Design**: Mobile-friendly interface

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- MongoDB database (local or cloud instance)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Resend (Email Service)
RESEND_API_KEY=your_resend_api_key

# Google Generative AI
GOOGLE_API_KEY=your_google_ai_api_key
```

### How to Get API Keys

1. **MongoDB URI**: Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster
2. **NextAuth Secret**: Generate with `openssl rand -base64 32` or any random string generator
3. **Resend API Key**: Sign up at [Resend](https://resend.com) and get your API key
4. **Google AI API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Getting Started

1. **Clone the repository**

```bash
git clone <repository-url>
cd fuse-app
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Set up environment variables**

Create a `.env.local` file and add the required environment variables (see above).

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
fuse-app/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # NextAuth configuration
│   │   ├── generate/        # AI generation endpoint
│   │   ├── history/         # User history endpoint
│   │   └── sign-up/         # User registration endpoint
│   ├── components/          # React components
│   ├── helpers/             # Utility functions
│   ├── history/             # History page
│   └── models/              # Frontend data models
├── context/                 # React context providers
├── email/                   # Email templates
├── lib/                     # Library configurations
│   ├── dbConnect.ts        # MongoDB connection
│   └── resend.ts           # Resend email config
├── models/                  # Mongoose models
├── schemas/                 # Zod validation schemas
└── types/                   # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Key Features Explanation

### Authentication Flow
1. User signs up with username, email, and password
2. Verification code is sent via email using Resend
3. User verifies email with OTP code
4. User can then sign in using NextAuth

### Email Verification
The app uses Resend to send verification emails. The email template is located in `email/index.tsx` and can be customized as needed.

### AI Generation
The `/api/generate` endpoint uses Google's Generative AI to create content based on user input.

## Database Models

- **User**: Stores user credentials, verification status, and metadata
- **History**: Tracks user's generation history

## Learn More

### Technologies Used

- [Next.js](https://nextjs.org/docs) - React framework
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [MongoDB](https://www.mongodb.com/) - Database
- [Mongoose](https://mongoosejs.com/) - ODM
- [Resend](https://resend.com/) - Email service
- [Google Generative AI](https://ai.google.dev/) - AI integration
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
