# Gym API

A gym check-in api.

## Getting Started

Setup the app container:

```shell
docker compose up -d
```

Setups the environment variables on a `.env` file based on the [.env.example](.env.example) file.

Install the dependencies:

```shell
npm i
```

Generate the prisma types:

```shell
npx prisma generate
```

Run the database migrations:

```shell
npx prisma migrate dev
```

## Requirements

### Functional Requirements

- [x] Should be able to register a gym;
- [x] Should be able to get gyms by name;
- [x] Should be able to register an user;
- [x] Should be able to authenticate an user;
- [x] Should be able to get the authenticated user profile infos;
- [x] Should be able to get the gyms close to the authenticated user;
- [x] Should be able for the authenticated user to check in to a gym;
- [x] Should be able to validate an user check-in;
- [x] Should be able to get the total number of check-in performed by an authenticated user;
- [x] Should be able to get the authenticated user check-in history;

### Business Rules

- [x] Should not be able to register an user with an already used e-amil;
- [x] Should not be able to check in more than once a day;
- [x] Should not be able to check in at a distance greater than 100 meters from the gym;
- [ ] Should not be able to validade a check-in after 20 minutes of its register;
- [ ] Only admin users should be able to validate a check-ins;
- [ ] Only admin users should be able to register a gym;

### Non-functional Requirements

- [x] The persisted user's password must be hashed;
- [x] The application's data must be persisted on a PostgreSQL database;
- [x] The pagination should list up to 20 items per page;
- [ ] The user must be identified by a JWT token;
