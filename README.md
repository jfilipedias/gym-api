# Gym API

A gym check-in api.

## Requirements

### Functional Requirements

- [ ] Should be able to register a gym;
- [ ] Should be able to get gyms by name;
- [ ] Should be able to register an user;
- [ ] Should be able to authenticate an user;
- [ ] Should be able to get the authenticated user profile infos;
- [ ] Should be able to get the gyms close to the authenticated user;
- [ ] Should be able to the authenticated user perform a check-in;
- [ ] Should be able to validate an user check-in;
- [ ] Should be able to get the total number of check-in performed by an authenticated user;
- [ ] Should be able to get the authenticated user check-in history;

### Business Rules

- [ ] Should not be able to register an user with an already used e-amil;
- [ ] Should not be able to perform more than one check-in per day;
- [ ] Should not be able to perform a check-in at a distance greater than 100 meters from the gym;
- [ ] Should not be able to validade a check-in after 20 minutes of its register;
- [ ] Only admin users should be able to validate a check-ins;
- [ ] Only admin users should be able to register a gym;

### Non-functional Requirements

- [ ] The persisted user's password must be hashed;
- [ ] The application's data must be persisted on a PostgreSQL database;
- [ ] The pagination should list up to 20 items per page;
- [ ] The user must be identified by a JWT token;
