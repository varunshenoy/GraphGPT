import './App.css';
import Graph from "react-graph-vis";
import React, { useState } from "react";

const OPENAI_API_KEY = "YOUR OPENAI API KEY";

const DEFAULT_PARAMS = {
  "model": "text-davinci-003",
  "temperature": 0.3,
  "max_tokens": 800,
  "top_p": 1,
  "frequency_penalty": 0,
  "presence_penalty": 0
}

const options = {
  layout: {
    hierarchical: false
  },
  edges: {
    color: "#34495e"
  }
};

function App() {
  const [state, setState] = useState(
    {
      counter: 0,
      graph: {
        nodes: [],
        edges: []
      }
    })
  const [errorState, setErrorState] = useState(null)
  const { graph } = state;

  const clearState = () => {
    setState({
      counter: 0,
      graph: {
        nodes: [],
        edges: []
      }
    })
  }

  const queryPrompt = (prompt) => {
    fetch('prompts/main.prompt')
      .then(response => response.text())
      .then(text => text.replace("$prompt", prompt))
      .then(text => text.replace("$state", JSON.stringify(state)))
      .then(prompt => {
        console.log(prompt)

        const params = { ...DEFAULT_PARAMS, prompt: prompt };

        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(OPENAI_API_KEY)
          },
          body: JSON.stringify(params)
        };
        fetch('https://api.openai.com/v1/completions', requestOptions)
          .then(response => response.json())
          .then(data => {
            console.log(data);

            if (data.error) {
              throw new Error(data.error.message);
            }

            const text = data.choices[0].text;
            console.log(text);

            let new_graph = null;
            try {
              new_graph = JSON.parse(text);
            } catch (error) {
              throw new Error(text.split('\n').pop());
            }

            console.log(new_graph);
            setState(new_graph, () => {
              console.log(state);
            });
            setErrorState(null);
            document.body.style.cursor = 'default';
            document.getElementsByClassName("generateButton")[0].disabled = false;
            document.getElementsByClassName("searchBar")[0].value = "";
          }).catch(error => {
            console.log(error.message);
            setErrorState(error.message);
            document.body.style.cursor = 'default';
            document.getElementsByClassName("generateButton")[0].disabled = false;
          });
      })
  }


  const createGraph = () => {
    // document.body.style.cursor = 'wait';
    const prompt = document.getElementsByClassName("searchBar")[0].value;
    if (prompt.length === 0) return;
    document.getElementsByClassName("generateButton")[0].disabled = true;

    queryPrompt(prompt);
  }

  return (
    <div className='container'>
      <h1 className="headerText">GraphGPT 🔎</h1>
      <p className='subheaderText'>Build complex, directed graphs to add structure to your ideas using natural language. Understand the relationships between people, systems, and maybe solve a mystery.</p>

      <center>
        <div className='inputContainer'>
          <input className="searchBar" placeholder="Describe your graph..."></input>
          <button className="generateButton" onClick={createGraph}>Generate</button>
          <button className="clearButton" onClick={clearState}>Clear</button>
          { errorState && <p className='errorText'>{errorState}</p> }
        </div>
      </center>
      <div className='graphContainer'>
        <Graph graph={graph} options={options} style={{ height: "640px" }} />
      </div>
      <p className='footer'>Pro tip: don't take a screenshot! You can right-click and save the graph as a .png  📸</p>
    </div>
  );
}

export default App;
