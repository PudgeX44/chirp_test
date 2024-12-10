export interface GoogleSearchAPIResults {
  items: { title: string; link: string; snippet: string }[];
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

export interface ActionDataResponse {
  companyData: GoogleSearchAPIResults["items"];
  companySummary: string;
}
