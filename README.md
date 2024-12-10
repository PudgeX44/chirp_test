# Cloning the codebase

- Clone the **branch** from the [repo](https://github.com/PudgeX44/chirp_test) using https

# Pre Setup

- Create a .env file and copy the contents of the example.env file
- Setup your custom google search [API](https://developers.google.com/custom-search/v1/introduction)
- Add the values of your search api key and your search engine id in the env file
- Generate a [Gemini](https://ai.google.dev/gemini-api/docs/api-key) API key and add it in your env file
- Create an account in [spoonacular](https://spoonacular.com/food-api/docs#Authentication) and generate an API key and add the key in your env file
- Create an account in [OpenWeather](https://openweathermap.org/api) and generate an API key and add it as well in your env file

# Installing dependencies

## NodeJS

- Install [NodeJS](https://nodejs.org/en) or [nvm](https://github.com/nvm-sh/nvm) (recommended)
- If installing NodeJS via nvm run:
  ```bash
   nvm install 20.17.0
  ```
- Confirm version after installation by running: `node -v`

## NPM

- From the terminal, install dependencies by running:
  ```bash
   npm install
  ```
- Run the development server by running:
  ```bash
   npm run dev
  ```

# Architecture

This project uses the remix framework for a fast and easy deployment. Simpler architecture makes it a better fit for smaller projects such as this. Faster development time as well with the functionality to combine both the frontend and backend functionalities in one file.
