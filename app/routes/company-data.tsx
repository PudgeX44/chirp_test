import { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import axios from "axios";
import {
  ActionDataResponse,
  GeminiResponse,
  GoogleSearchAPIResults,
} from "~/types/company-data.types";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const company = formData.get("company");
  const response = await axios.get<GoogleSearchAPIResults>(
    `https://www.googleapis.com/customsearch/v1?q=${company}+news&key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}`
  );

  // content to be sent to the gemini API conversation
  const dataForAI = response.data.items.map((item) => item.title).join(",");
  const postDataForAI = {
    contents: [
      {
        parts: [
          {
            text: `Generate a brief company summary for ${company} without any conversational phrases or extra commentary given the data., ${dataForAI}`,
          },
        ],
      },
    ],
  };

  const geminiResponse = await axios.post<GeminiResponse>(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_SECRET_KEY}`,
    postDataForAI,
    { headers: { ContentType: "application/json" } }
  );

  return {
    companyData: response.data.items,
    companySummary: geminiResponse.data.candidates[0].content.parts[0].text,
  };
}

export default function CompanyData() {
  const data = useActionData<ActionDataResponse>();
  const { state } = useNavigation();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Link
        to="/"
        className="text-blue-500 hover:text-blue-700 underline mb-4 inline-block"
      >
        Back
      </Link>

      <Form
        method="post"
        action="/company-data"
        className="bg-white p-6 rounded-lg shadow-md mb-6"
      >
        <div className="mb-4">
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Company Domain
          </label>
          <input
            id="company"
            name="company"
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="Enter company domain"
          />
        </div>

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
          <div className="mb-6">
            <h4 className="text-xl font-semibold text-gray-800">
              {data?.companySummary}
            </h4>
          </div>

          <div className="space-y-4">
            {data && <h2 className="text-xl">Related Links</h2>}

            {data?.companyData.map((data, index) => (
              <Link
                to={data.link}
                key={index}
                target="_blank"
                rel="noreferrer"
                className="block bg-white p-4 rounded-lg shadow-md hover:bg-gray-50 transition"
              >
                <h4 className="text-lg font-semibold text-gray-800">
                  {data.title}
                </h4>
                <p className="text-sm text-gray-600">{data.snippet}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
