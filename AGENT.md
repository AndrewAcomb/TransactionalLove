# Dating app with transaction history

## What is the problem?

- People are not able to find the right person for them. Matching is based on transaction history.

## What is the solution?

- A dating app that allows you to find the right person for you based on your transaction history.

## Tech stack

- Frontend: React
- Backend: FastAPI
- Database: PostgreSQL
- LLM: OpenAI
- Plaid

# What happens in the demo?

- Create account (sign up with email)
- Connect account(s) via Plaid
- A profile is generated for you via LLM
- You add additional information 
  - typical dating app info like photos age, location, alma mater, job)
- You can swipe through profiles (we will create some fake women profiles for the demo)
- You can chat with the other person’s profile to get more information
- You can match with people and it shows a normal chat with them (this part doesn’t have to be functional, the demo ends when we match with a profile)
