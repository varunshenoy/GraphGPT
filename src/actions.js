export const ACTIONS = {
  ADD_GRAPH: "ADD_GRAPH",
  CLEAR_GRAPH: "CLEAR_GRAPH",
};

export const clearGraph = (dispatch) => {
  dispatch({ type: ACTIONS.CLEAR_GRAPH });
};

export const addGraph = (payload, dispatch) => {
  dispatch({ type: ACTIONS.ADD_GRAPH, payload: payload });
};
