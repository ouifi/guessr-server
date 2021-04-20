- [Intro](#intro)
- [Getting Started](#getting-started)
  - [Environment](#environment)
  - [Running](#running)

# Intro
The api server for Guessr.io

# Getting Started

## Environment 
Create a `.env` file with the following values from your own reddit bot account.
```
REDDIT_CLIENT_SECRET=<secret>
REDDIT_CLIENT_ID=<id>
NODE_ENV={ development | production }
LOG_LEVEL={ NONE | ERROR | WARN | LOG | [DEBUG] | VERBOSE }
```

## Running
```bash
npm start
```