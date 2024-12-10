import { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import axios from "axios";
import { RecipeFinderResponseItem } from "~/types/recipe-finder.types";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const ingredients = formData.get("ingredients");
  const response = await axios.get<RecipeFinderResponseItem[]>(
    `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${process.env.SPOONACULAR_API_KEY}&ingredients=${ingredients}`
  );

  // Sort the data by the most number of available ingredients
  const sortedResponse = response.data.sort(
    (a, b) => a.usedIngredientCount - b.usedIngredientCount
  );

  return sortedResponse;
}

export default function RecipeFinder() {
  const data = useActionData<RecipeFinderResponseItem[]>();

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      <Link
        to="/"
        className="text-blue-500 hover:text-blue-700 underline inline-block"
      >
        Back
      </Link>

      <Form
        method="post"
        action="/recipe-finder"
        className="bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <div>
          <label
            htmlFor="ingredients"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Ingredients
          </label>
          <input
            name="ingredients"
            id="ingredients"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="Enter ingredients (comma separated)"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Search
        </button>
      </Form>

      <div className="space-y-6">
        {data?.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-lg shadow-md space-y-4"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-40 object-cover rounded-md"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              {item.title}
            </h2>
            <div>
              <h4 className="text-lg font-medium text-gray-700">Ingredients</h4>
              <p className="text-gray-600">
                {item.usedIngredients
                  .map((ingredient) => ingredient.name)
                  .join(", ")}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-700">
                Missing Ingredients
              </h4>
              <p className="text-gray-600">
                {item.missedIngredients
                  .map((ingredient) => ingredient.name)
                  .join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
