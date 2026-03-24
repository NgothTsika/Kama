# Kama - History Learning + Multiplayer Quiz Game Backend

A comprehensive backend server for a history learning and multiplayer quiz game application. Built with Express, TypeScript, Prisma ORM, and Supabase.

## 🚀 Features

### Authentication & Users

- Supabase authentication (Google & Apple OAuth)
- User profiles with preferences (country, language, avatar)
- JWT-based API authentication
- Auto-detect language/country from device

### Gamification System

- ❤️ Hearts system (lives that refill over time)
- ⭐ XP & Level progression system
- 🏅 Rank tiers (Bronze, Silver, Gold, Diamond, Legend)
- 💰 Coins/currency system
- 🎁 Daily rewards with streak tracking
- 💎 Premium subscription (infinite hearts)

### Learning System

- 📚 **Hierarchical Learning Paths** (Courses → Lessons → Content)
- 🧑‍🏫 **Historical Figures** with rich bio data
- 🌳 **Hierarchical Category System** (Continent → Country → Role/Profession)
- ❓ **Questions & Answers** with multiple choice
- 🎯 **Lesson Progress Tracking**
- 📖 **Flashcards** with spaced repetition (SM-2 algorithm)

### Multiplayer Gaming

- 🎮 Three game modes:
  - **SOLO**: Single player challenges
  - **DUEL**: 1v1 competitive matches
  - **TEAM**: 3v3 team battles
- ⏱️ Match lifecycle management (WAITING → IN_PROGRESS → FINISHED)
- 📊 Score calculation with response time bonuses
- 🏆 Winner determination & XP rewards

### Leaderboards

- 🌍 Global weekly leaderboard
- 🇳🇬 Country-specific leaderboards
- 🎯 Weekly rank-based rewards (XP + coins)
- Historical leaderboard entries

### Additional Features

- 🏅 Achievements & unlocking system
- 📋 Comprehensive activity logs (XP, hearts)
- 🌐 Multi-language support with LocalizedContent
- 📱 Mobile-first API design

## 📋 Requirements

- Node.js 18+
- npm or yarn
- PostgreSQL database (via Supabase or self-hosted)
- Supabase account for authentication

## 🔧 Setup

### 1. Clone & Install Dependencies

```bash
cd server
yarn install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

**Environment Variables:**

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Server
PORT=4000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:4000,http://localhost:4001
```

### 3. Database Setup

Initialize Prisma and run migrations:

```bash
# Generate Prisma Client
yarn generate

# Run migrations
yarn migrate:dev

# Seed initial data
yarn seed
```

### 4. Start Development Server

```bash
yarn dev
```

Server will start on `http://localhost:4000`

## 📚 API Documentation

### Base URL

```
http://localhost:4000/api
```

### Authentication

All protected endpoints require an Authorization header:

```
Authorization: Bearer <supabase_jwt_token>
```

### Core Endpoints

#### User Management

- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update profile
- `GET /users/stats` - Get user stats (XP, level, rank)
- `GET /users/hearts` - Get heart status
- `POST /users/hearts/refill` - Refill hearts
- `GET /users/xp-logs` - Get XP activity log

#### Learning Paths & Lessons

- `GET /learning/paths` - List learning paths
- `GET /learning/paths/:pathId` - Get path details
- `GET /learning/paths/:pathId/lessons` - Get lessons in path
- `GET /learning/lessons/:lessonId` - Get lesson details
- `GET /learning/lessons/:lessonId/progress` - Get lesson progress
- `PUT /learning/lessons/:lessonId/progress` - Update lesson progress

#### Figures & Categories

- `GET /figures` - List figures
- `GET /figures/:figureId` - Get figure details
- `GET /figures/search?q=name` - Search figures
- `GET /categories` - List all categories
- `GET /categories/root` - Get root categories only
- `GET /categories/:categoryId` - Get category details
- `GET /categories/:categoryId/children` - Get subcategories

#### Questions & Flashcards

- `GET /questions` - List questions
- `GET /questions/:questionId` - Get question details
- `POST /questions/verify` - Verify answer (request: { questionId, answerId })
- `GET /lessons/:lessonId/flashcards` - Get lesson flashcards
- `GET /flashcards/reviews` - Get user's flashcard reviews
- `POST /flashcards/reviews` - Update flashcard review (request: { flashcardId, quality })

#### Multiplayer Gaming

- `POST /matches` - Create new match (request: { mode: "SOLO"|"DUEL"|"TEAM" })
- `POST /matches/:matchId/join` - Join match
- `POST /matches/:matchId/start` - Start match
- `POST /matches/:matchId/submit-answer` - Submit answer (request: { matchQuestionId, answerId, responseTimeMs })
- `POST /matches/:matchId/finish` - Finish match
- `GET /matches/:matchId` - Get match details
- `GET /matches` - Get user's match history
- `POST /matches/:matchId/cancel` - Cancel match

#### Leaderboards

- `GET /leaderboard/global?weekOffset=0&skip=0&take=50` - Global leaderboard
- `GET /leaderboard/country/:countryCode` - Country leaderboard
- `GET /leaderboard/me/global-rank` - Get user's global rank
- `GET /leaderboard/me/country-rank/:countryCode` - Get user's country rank
- `POST /leaderboard/claim-rewards` - Claim weekly leaderboard rewards

## 🏗️ Project Structure

```
server/
├── src/
│   ├── app.ts                    # Express app setup
│   ├── index.ts                  # Server entry point
│   ├── config/
│   │   └── supabase.ts          # Supabase client
│   ├── middleware/
│   │   ├── auth.ts              # JWT verification
│   │   └── errorHandler.ts      # Error handling
│   ├── controllers/
│   │   ├── userController.ts
│   │   ├── learningController.ts
│   │   ├── figureController.ts
│   │   ├── questionController.ts
│   │   ├── gameController.ts
│   │   └── leaderboardController.ts
│   ├── services/
│   │   ├── userService.ts
│   │   ├── heartService.ts
│   │   ├── xpService.ts
│   │   ├── dailyRewardService.ts
│   │   ├── learningService.ts
│   │   ├── figureService.ts
│   │   ├── questionService.ts
│   │   ├── gameService.ts
│   │   └── leaderboardService.ts
│   ├── routes/
│   │   └── index.ts
│   └── utils/
│       ├── prisma.ts            # Prisma client singleton
│       ├── helpers.ts           # Utility functions
│       └── constants.ts         # Game constants
├── prisma/
│   ├── schema.prisma            # Data model
│   └── seed.ts                  # Seed script
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## 🔑 Key Services

### User Service

- Create/update user profiles
- Track user stats (XP, level, rank)
- Award XP with logging

### Heart Service

- Track and manage heart (life) system
- Auto-refill hearts over time
- Premium user handling (infinite hearts)

### Daily Reward Service

- Track daily login streaks
- Distribute daily rewards
- Reset streaks on missed days

### Learning Service

- Manage learning paths and lessons
- Track lesson/path progress
- Calculate progress percentages

### Game Service

- Create and manage matches
- Handle player submissions and scoring
- Determine winners and award XP

### Leaderboard Service

- Calculate and store weekly leaderboards
- Get user rankings (global & country)
- Distribute weekly rewards

## 📊 Database Schema

The Prisma schema includes:

- **User Models**: User, Language, Country, Subscription
- **Gamification**: Hearts, XP logs, Achievements
- **Learning**: LearningPath, Lesson, Figure, Category, Question, Flashcard
- **Gaming**: Match, MatchPlayer, MatchQuestion, PlayerAnswer
- **Leaderboard**: LeaderboardEntry, WeeklyReward

See `prisma/schema.prisma` for full details.

## 🧪 Testing

Run the seed script to populate test data:

```bash
npm run seed
```

Use tools like Postman or curl to test endpoints.

## 🚨 Error Handling

All API responses follow a consistent error format:

**Success Response (200-201):**

```json
{
  "id": "...",
  "data": "..."
}
```

**Error Response (4xx-5xx):**

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

## 🔐 Security

- JWT authentication with Supabase
- CORS configuration
- Input validation with Zod
- Rate limiting ready (implement with express-rate-limit)
- Environment variable protection

## 📈 Performance

- Indexed database queries
- Pagination support on list endpoints
- Efficient relationship loading
- Prisma query optimization

## 🚀 Deployment

### Build for Production

```bash
yarn build
```

### Run Production Server

```bash
yarn start
```

### Environment

```bash
NODE_ENV=production
```

## 📝 Contributing

1. Follow TypeScript strict mode
2. Use service layer for business logic
3. Add error handling for all operations
4. Document complex functions
5. Test API endpoints

## 📄 License

MIT

## 👥 Authors

Created by Mokozi Tech

## 🤝 Support

For issues and questions, please create an issue in the repository.
