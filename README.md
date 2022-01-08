# answering-forum-backend

[![License](https://img.shields.io/github/license/dhi13man/answering-forum-backend)](https://github.com/Dhi13man/answering-forum-backend/blob/main/LICENSE)
[![Contributors](https://img.shields.io/github/contributors-anon/dhi13man/answering-forum-backend?style=flat)](https://github.com/Dhi13man/answering-forum-backend/graphs/contributors)
[![GitHub forks](https://img.shields.io/github/forks/dhi13man/answering-forum-backend?style=social)](https://github.com/Dhi13man/answering-forum-backend/network/members)
[![GitHub Repo stars](https://img.shields.io/github/stars/dhi13man/answering-forum-backend?style=social)](https://github.com/Dhi13man/answering-forum-backend/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/dhi13man/answering-forum-backend)](https://github.com/Dhi13man/answering-forum-backend/commits/main)
[![Node.js CI](https://github.com/Dhi13man/answering-forum-backend/workflows/Node.js%20CI/badge.svg)](https://github.com/Dhi13man/answering-forum-backend/actions)

A Node.js Express backend for a Stackoverflow like answering forum, with RESTful endpoints, written in es6 style with linted and comprehensively unit-tested code. Utilizes a local json database using fs but has full separation of concern to implement anything else.

Created as a part of week 0 of Swiggy i++ learning programme, round 2.

## Contents

- [answering-forum-backend](#answering-forum-backend)
  - [Contents](#contents)
  - [Setup](#setup)
  - [Usage](#usage)
    - [Project Structure](#project-structure)
  - [License](#license)
  - [Contributing](#contributing)
  - [Tests](#tests)

## Setup

1. Install [NodeJS](https://nodejs.org/en/) and any NodeJS package manager.
    - [npm](https://www.npmjs.com/)
    - [yarn](https://yarnpkg.com/)

2. Run `npm install` or `yarn install` to install the dependencies.

3. Run `npm run build` or `yarn build` once to let babel build the application on ./lib/.

## Usage

Run `npm run start` or `yarn start` after building to run the application on localhost:4000 (default).

### Project Structure

The project's code structure loosely follows MVC model while maintaing complete seperation of concern.

- answering-forum-backend
  - src
    - controllers
      - login_post.js
      - answers
        - answer_post.js
      - questions
        - question_get.js
        - question_post.js
      - register_post.js
    - database
      - answers.json
      - questions.json
      - users.json
    - models
      - answer_data.js
      - question_data.js
      - user_data.js
    - repositories
      - answers.js
      - questions.js
      - users.js
    - routes
      - login.js
      - question
        - questionID
          - answer.js
          - index.js
        - index.js
      - register.js
    - utils
      - validators.js
    - index.js
  - tests
    - controllers
      - answer
        - answer_post.test.js
      - question
        - question_get.test.js
        - question_post.test.js
      - login_post.test.js
      - register_post.test.js
    - database
      - answers.test.json
      - questions.test.json
      - users.test.json
    - repositories
      - answers.test.js
      - questions.test.js
      - users.test.js
  - .eslintrc.yml
  - babel.config.json
  - package.json
  - package-lock.json

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/Dhi13man/answering-forum-backend/blob/main/LICENSE) for details.

## Contributing

Feel free to contribute pull requests, issues for either APIs or tests. See the [CONTRIBUTING.md](https://github.com/Dhi13man/answering-forum-backend/blob/main/CONTRIBUTING.md) for details.

## Tests

Run `npm test` or `yarn test` to run the unit tests. Feel free to add your own tests for better test coverage while contributing.
