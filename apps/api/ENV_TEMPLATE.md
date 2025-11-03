# YouBet API - Environment Variables

Copy this file to `.env` in the `apps/api` directory and fill in your values.

## Database
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/youbet?schema=public"
```

## Redis
```
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""
```

## JWT
```
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
JWT_REFRESH_EXPIRES_IN="7d"
```

## OAuth - Google
```
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3001/api/v1/auth/google/callback"
```

## OAuth - Apple
```
APPLE_CLIENT_ID="your-apple-client-id"
APPLE_TEAM_ID="your-apple-team-id"
APPLE_KEY_ID="your-apple-key-id"
APPLE_PRIVATE_KEY_PATH="./apple-key.p8"
APPLE_CALLBACK_URL="http://localhost:3001/api/v1/auth/apple/callback"
```

## SMS/OTP - Twilio
```
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"
```

## File Storage - S3/R2
```
S3_ENDPOINT="http://localhost:9000"
S3_REGION="us-east-1"
S3_BUCKET="youbet-uploads"
S3_ACCESS_KEY="minioadmin"
S3_SECRET_KEY="minioadmin"
S3_PUBLIC_URL="http://localhost:9000/youbet-uploads"
```

## Application
```
PORT=3001
NODE_ENV="development"
API_PREFIX="api/v1"
CORS_ORIGIN="http://localhost:3000"
```

## Rate Limiting
```
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

## Sports Data API
```
SPORTS_API_KEY="your-sports-api-key"
SPORTS_API_URL="https://api.sportsdata.io"
```

## Frontend URL
```
FRONTEND_URL="http://localhost:3000"
```

