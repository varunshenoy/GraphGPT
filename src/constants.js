// Either export an env variable OPENAI_API_KEY or add it inline here
export const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || "API KEY";

export const DEFAULT_PARAMS = {
  model: "text-davinci-003",
  temperature: 0.3,
  max_tokens: 800,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};

export const OPTIONS = {
  layout: {
    hierarchical: false,
  },
  edges: {
    color: "#34495e",
  },
  interaction: {
    navigationButtons: true,
    keyboard: true,
  },
};

export const requestOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + String(OPENAI_API_KEY),
  },
};
