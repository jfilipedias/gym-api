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

- [ ] Should be able to register a gym;
- [ ] Should be able to get gyms by name;
- [x] Should be able to register an user;
- [ ] Should be able to authenticate an user;
- [ ] Should be able to get the authenticated user profile infos;
- [ ] Should be able to get the gyms close to the authenticated user;
- [ ] Should be able to the authenticated user perform a check-in;
- [ ] Should be able to validate an user check-in;
- [ ] Should be able to get the total number of check-in performed by an authenticated user;
- [ ] Should be able to get the authenticated user check-in history;

### Business Rules

- [x] Should not be able to register an user with an already used e-amil;
- [ ] Should not be able to perform more than one check-in per day;
- [ ] Should not be able to perform a check-in at a distance greater than 100 meters from the gym;
- [ ] Should not be able to validade a check-in after 20 minutes of its register;
- [ ] Only admin users should be able to validate a check-ins;
- [ ] Only admin users should be able to register a gym;

### Non-functional Requirements

- [x] The persisted user's password must be hashed;
- [ ] The application's data must be persisted on a PostgreSQL database;
- [ ] The pagination should list up to 20 items per page;
- [ ] The user must be identified by a JWT token;
