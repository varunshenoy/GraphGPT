import "./App.css";
import Graph from "react-graph-vis";
import React, { useReducer, useState } from "react";
import { graphReducer, initialState } from "./graphReducer";
import { addGraph, clearGraph } from "./actions";
import { DEFAULT_PARAMS, requestOptions, OPTIONS } from "./constants";

function App() {
  const [graphState, dispatch] = useReducer(graphReducer, initialState);

  const [inputPrompt, setInputPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const { graph } = graphState;

  const queryPrompt = (prompt) => {
    setLoading(true);
    fetch("prompts/main.prompt")
      .then((response) => response.text())
      .then((text) => text.replace("$prompt", prompt))
      .then((text) => text.replace("$state", JSON.stringify(graphState)))
      .then((prompt) => {
        const params = { ...DEFAULT_PARAMS, prompt: prompt };

        fetch("https://api.openai.com/v1/completions", {
          ...requestOptions,
          body: JSON.stringify(params),
        })
          .then((response) => response.json())
          .then((data) => {
            setLoading(false);
            const text = data.choices[0].text;
            const new_graph = JSON.parse(text);
            addGraph(new_graph, dispatch);
            setInputPrompt("");
          })
          .catch((error) => {
            console.error(error);
            setLoading(false);
          });
      });
  };

  const createGraph = () => {
    queryPrompt(inputPrompt);
  };

  return (
    <div className="container">
      <h1 className="headerText">GraphGPT 🔎</h1>
      <p className="subheaderText">
        Build complex, directed graphs to add structure to your ideas using
        natural language. Understand the relationships between people, systems,
        and maybe solve a mystery.
      </p>

      <center>
        <div className="inputContainer">
          <input
            className="searchBar"
            placeholder="Describe your graph..."
            value={inputPrompt}
            onChange={(e) => {
              setInputPrompt(e.target.value);
            }}
          ></input>
          <button
            className="generateButton"
            onClick={createGraph}
            disabled={loading}
          >
            {loading ? "Loading" : "Generate"}
          </button>
          <button
            className="clearButton"
            onClick={() => {
              clearGraph(dispatch);
            }}
          >
            Clear
          </button>
        </div>
      </center>
      <div className="graphContainer">
        <Graph graph={graph} options={OPTIONS} style={{ height: "640px" }} />
      </div>
      <p className="footer">
        Pro tip: don't take a screenshot! You can right-click and save the graph
        as a .png 📸
      </p>
    </div>
  );
}

export default App;
