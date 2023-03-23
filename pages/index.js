import React, { useState } from "react";
import dynamic from "next/dynamic";
import { STATELESS_PROMPT, STATEFUL_PROMPT } from "../constants/prompts";
import { PLANT_GRAPH } from "../constants/graphs";

const Graph = dynamic(() => import("react-graph-vis"), {
  ssr: false,
});

const SELECTED_PROMPT = "STATELESS";

const options = {
  layout: {
    hierarchical: false,
  },
  edges: {
    color: "#34495e",
  },
};

function App() {
  const [graphState, setGraphState] = useState(PLANT_GRAPH);

  const clearState = () => {
    setGraphState({
      nodes: [],
      edges: [],
    });
  };

  const updateGraph = (updates) => {
    // updates will be provided as a list of lists
    // each list will be of the form [ENTITY1, RELATION, ENTITY2] or [ENTITY1, COLOR]

    var current_graph = JSON.parse(JSON.stringify(graphState));

    if (updates.length === 0) {
      return;
    }

    // check type of first element in updates
    if (typeof updates[0] === "string") {
      // updates is a list of strings
      updates = [updates];
    }

    updates.forEach((update) => {
      if (update.length === 3) {
        // update the current graph with a new relation
        const [entity1, relation, entity2] = update;

        // check if the nodes already exist
        var node1 = current_graph.nodes.find((node) => node.id === entity1);
        var node2 = current_graph.nodes.find((node) => node.id === entity2);

        if (node1 === undefined) {
          current_graph.nodes.push({
            id: entity1,
            label: entity1,
            color: "#ffffff",
          });
        }

        if (node2 === undefined) {
          current_graph.nodes.push({
            id: entity2,
            label: entity2,
            color: "#ffffff",
          });
        }

        // check if an edge between the two nodes already exists and if so, update the label
        var edge = current_graph.edges.find(
          (edge) => edge.from === entity1 && edge.to === entity2
        );
        if (edge !== undefined) {
          edge.label = relation;
          return;
        }

        current_graph.edges.push({
          from: entity1,
          to: entity2,
          label: relation,
        });
      } else if (update.length === 2 && update[1].startsWith("#")) {
        // update the current graph with a new color
        const [entity, color] = update;

        // check if the node already exists
        var node = current_graph.nodes.find((node) => node.id === entity);

        if (node === undefined) {
          current_graph.nodes.push({ id: entity, label: entity, color: color });
          return;
        }

        // update the color of the node
        node.color = color;
      } else if (update.length === 2 && update[0] == "DELETE") {
        // delete the node at the given index
        const [_, index] = update;

        // check if the node already exists
        var node = current_graph.nodes.find((node) => node.id === index);

        if (node === undefined) {
          return;
        }

        // delete the node
        current_graph.nodes = current_graph.nodes.filter(
          (node) => node.id !== index
        );

        // delete all edges that contain the node
        current_graph.edges = current_graph.edges.filter(
          (edge) => edge.from !== index && edge.to !== index
        );
      }
    });
    setGraphState(current_graph);
  };

  const queryStatelessPrompt = (promptValue) => {
    const prompt = STATELESS_PROMPT.replace("$prompt", promptValue);

    fetch("api/model/query", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    })
      .then((response) => {
        if (!response.ok) {
          switch (response.status) {
            case 401: // 401: Unauthorized: API key is wrong
              throw new Error("Please double-check your API key.");
            case 429: // 429: Too Many Requests: Need to pay
              throw new Error(
                "You exceeded your current quota, please check your plan and billing details."
              );
            default:
              throw new Error(
                "Something went wrong with the request, please check the Network log"
              );
          }
        }
        return response.json();
      })
      .then((response) => {
        console.log(response);

        const { choices } = response;
        const text = choices[0].text;
        console.log(text);

        const updates = JSON.parse(text);
        console.log(updates);

        updateGraph(updates);

        document.getElementsByClassName("searchBar")[0].value = "";
        document.body.style.cursor = "default";
        document.getElementsByClassName("generateButton")[0].disabled = false;
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  const queryStatefulPrompt = (promptValue) => {
    const prompt = STATEFUL_PROMPT.replace("$prompt", promptValue);

    fetch("api/model/query", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    })
      .then((response) => {
        if (!response.ok) {
          switch (response.status) {
            case 401: // 401: Unauthorized: API key is wrong
              throw new Error("Please double-check your API key.");
            case 429: // 429: Too Many Requests: Need to pay
              throw new Error(
                "You exceeded your current quota, please check your plan and billing details."
              );
            default:
              throw new Error(
                "Something went wrong with the request, please check the Network log"
              );
          }
        }
        return response.json();
      })
      .then((response) => {
        const { choices } = response;
        const text = choices[0].text;
        console.log(text);

        const new_graph = JSON.parse(text);

        setGraphState(new_graph);

        document.getElementsByClassName("searchBar")[0].value = "";
        document.body.style.cursor = "default";
        document.getElementsByClassName("generateButton")[0].disabled = false;
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  const queryPrompt = (prompt) => {
    if (SELECTED_PROMPT === "STATELESS") {
      queryStatelessPrompt(prompt);
    } else if (SELECTED_PROMPT === "STATEFUL") {
      queryStatefulPrompt(prompt);
    } else {
      alert("Please select a prompt");
      document.body.style.cursor = "default";
      document.getElementsByClassName("generateButton")[0].disabled = false;
    }
  };

  const createGraph = () => {
    document.body.style.cursor = "wait";

    document.getElementsByClassName("generateButton")[0].disabled = true;
    const prompt = document.getElementsByClassName("searchBar")[0].value;

    queryPrompt(prompt);
  };

  console.log(process.env.MODEL_PRESENCE_PENALTY); // 0.1

  return (
    <div className="container">
      {/* <h1 className="headerText">GraphGPT 🔎</h1> */}
      {/* <p className="subheaderText">
        Build complex, directed graphs to add structure to your ideas using
        natural language. Understand the relationships between people, systems,
        and maybe solve a mystery.
      </p>
      <p className="opensourceText">
        <a href="https://github.com/varunshenoy/graphgpt">
          GraphGPT is open-source
        </a>
        &nbsp;🎉
      </p> */}
      {/* <center>
        <div className="inputContainer">
          <input
            className="searchBar"
            placeholder="Describe your graph..."
          ></input>
          <button className="generateButton" onClick={createGraph}>
            Generate
          </button>
          <button className="clearButton" onClick={clearState}>
            Clear
          </button>
        </div>
      </center> */}
      <div className="graphContainer">
        <Graph
          graph={graphState}
          options={options}
          style={{ height: "80vh" }}
        />
      </div>
      <p className="footer">
        Pro tip: don't take a screenshot! You can right-click and save the graph
        as a .png 📸
      </p>
    </div>
  );
}

export default App;
