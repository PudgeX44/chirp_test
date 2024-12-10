import { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import {
  ActionDataResponse,
  WardrobeItem,
  WeatherAPIResponse,
} from "~/types/weather-recommender.types";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const location = formData.get("location");
  const wardrobe: WardrobeItem[] = JSON.parse(
    formData.get("wardrobe")?.toString() ?? ""
  );
  const response = await axios.get<WeatherAPIResponse>(
    `http://api.openweathermap.org/data/2.5/weather?q=${location}&apikey=${process.env.WEATHER_API_KEY}&units=metric`
  );

  // Basic algorithm just for checking if item is within the temperature range of the location
  const recommendedOutfits = wardrobe.filter((item) => {
    const tempRange = item.temperatureRange
      .split("-")
      .map((range) => Number(range));

    // If location temp is greater than 30 check if temperature range is equal to 30+
    if (response.data.main.temp > 30 && item.temperatureRange === "30+") {
      return true;
    }

    // Else check if it is within the range of the item's temperature range
    if (
      response.data.main.temp > tempRange[0] &&
      response.data.main.temp < tempRange[1]
    ) {
      return true;
    }

    return false;
  });

  return {
    weather: response.data,
    recommendedOutfits,
  };
}

export default function WeatherRecommender() {
  const data = useActionData<ActionDataResponse>();
  const { state } = useNavigation();
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  const [isAddingWardRobe, setIsAddingWardRobe] = useState(false);
  const [formValues, setFormValues] = useState({
    type: "pants",
    temperatureRange: "0-10",
    formality: "formal",
  });

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    setWardrobe((prevItems) => {
      const itemExists = prevItems.some(
        (item) =>
          item.type === formValues.type &&
          item.temperatureRange === formValues.temperatureRange &&
          item.formality === formValues.formality
      );

      // Add the item only if it doesn't already exist
      if (!itemExists) {
        return [...prevItems, formValues];
      } else {
        return prevItems;
      }
    });

    setIsAddingWardRobe(false);
  };

  const handleDelete = (wardrobeItem: WardrobeItem) => {
    setWardrobe((prevItems) => {
      const filteredItems = prevItems.filter(
        (item) =>
          item.type !== wardrobeItem.type ||
          item.temperatureRange !== wardrobeItem.temperatureRange ||
          item.formality !== wardrobeItem.formality
      );

      return filteredItems;
    });

    setIsAddingWardRobe(false);
  };

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
        action="/weather-recommender"
        className="bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Location
          </label>
          <input
            name="location"
            id="location"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="Enter location"
          />
        </div>
        <input type="hidden" name="wardrobe" value={JSON.stringify(wardrobe)} />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Search
        </button>
      </Form>

      {state === "submitting" ? (
        <div className="flex items-center justify-center">Loading...</div>
      ) : (
        <>
          {data && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                  Weather
                </h1>
                <h4 className="text-gray-700">
                  Temperature: {data?.weather.main.temp}
                </h4>
                <h4 className="text-gray-700">
                  Humidity: {data?.weather.main.humidity}
                </h4>
                <h4 className="text-gray-700">
                  Pressure: {data?.weather.main.pressure}
                </h4>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                  Recommended Items
                </h1>
                <ul className="space-y-2">
                  {data.recommendedOutfits.map((item, index) => (
                    <li
                      key={index}
                      className="p-2 border rounded-lg bg-gray-50 text-gray-700"
                    >
                      Type: {item.type}, Temperature: {item.temperatureRange},
                      Formality: {item.formality}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}

      <button
        onClick={() => setIsAddingWardRobe(true)}
        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
      >
        Add Wardrobe Item
      </button>

      {isAddingWardRobe && (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Type
            </label>
            <select
              name="type"
              id="type"
              value={formValues.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="pants">Pants</option>
              <option value="skirt">Skirt</option>
              <option value="shirt">Shirt</option>
              <option value="sweater">Sweater</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="temperatureRange"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Temperature Range
            </label>
            <select
              name="temperatureRange"
              id="temperatureRange"
              value={formValues.temperatureRange}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="0-10">0-10</option>
              <option value="10-20">10-20</option>
              <option value="20-30">20-30</option>
              <option value="30+">30+</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="formality"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Formality
            </label>
            <select
              name="formality"
              id="formality"
              value={formValues.formality}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="formal">Formal</option>
              <option value="semi-formal">Semi-Formal</option>
              <option value="casual">Casual</option>
            </select>
          </div>

          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Add
          </button>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Wardrobe Items
        </h3>
        <ul className="space-y-2">
          {wardrobe.map((item, index) => (
            <li
              key={index}
              className="p-2 border rounded-lg bg-gray-50 text-gray-700 flex items-center justify-between"
            >
              <p>
                Type: {item.type}, Temperature: {item.temperatureRange},
                Formality: {item.formality}
              </p>
              <button
                onClick={() => handleDelete(item)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
