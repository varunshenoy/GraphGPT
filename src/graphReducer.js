import { ACTIONS } from "./actions";

export const initialState = {
  counter: 0,
  graph: {
    nodes: [],
    edges: [],
  },
};

export const graphReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_GRAPH:
      return {
        ...action.payload,
      };
    case ACTIONS.CLEAR_GRAPH:
      return initialState;
    default:
      return state;
  }
};
