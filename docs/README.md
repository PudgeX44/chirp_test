# Approach

Approached the project by doing research on what better framework to use. Ended up using Remix as I've researched that it is better for small projects such as this. After choosing the framework, started researching about the other external APIs that I was going to use as well

# 1st task:

- Used Google's Search API out of the three options as it is the most simple and straightforward solution for completing the task
- For the LLM model: this is my first time integrating an LLM model so I was initially trying to use the OpenAI's API for the task since it is the most used API but unfortunately read that they don't do free trials and you have to pay for credits to use their model. So I ended up using Gemini, Google's AI model since they have a free tier for it.

# 2nd task:

- Used spoonacular's API as it supports ingredient searching to get recipes which is the exact requirement for the task
- The API also has the number of used ingredients returned in the data so I just sorted the results based on that to show first the recipe with the most number of ingredients
- For the filters, the ingredients list has an "aisle" category. The API also provides all the list of the aisle data, so I just used this category for the mock filtering of the recipes. Filtered out the recipes if at least one of the ingredients is included in the selected "aisle" category

# 3rd Task:

- Used the OpenWeather API to search for the weather conditions based on the location inputted by the user
- Just used 3 categories for the wardrobe items and created mock data for each of them namely: type, temperature range, and formality. Usually when you have an add functionality like this, you use a database to save the date but I just used the React's state variable for now just for the simulation of adding data in the wardrobe.
- Made the recommended outfits algorithm very simple. Just matched the temperature range of the outfits to the current temperature of the location searched.

# Challenges and utilization of AI

Some of the challenged faced are the familiarity with Remix. This is my first time creating an application using Remix as a framework so I was creating a new application while learning the framework as well. AI helped me to shorten the time needed to learn the required features for the application. Along with the documentation, I also consulted AI for some of the syntax to make the development time faster and not have to search through the documentation to find the use cases for the features I was implementing.

AI also helped me with the clean up styling to lessen the time for development. I created a skeleton framework for the website and have AI help me clean up some of the styling as implementing all of the styling would take a while, especially that I did all three of the tasks. Doing so helped me focus more on making the prototypes and functionalities work.
