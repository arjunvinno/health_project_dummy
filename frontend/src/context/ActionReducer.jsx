import * as types from "./actionType";

export const reducer = (state, action) => {
  switch (action.type) {
    case types.editData: {
      let newState = {
        edit: true,
        complete: false,
      };
      return newState;
    }

    case types.completeData: {
      let newState = {
        edit: false,
        complete: true,
      };
      return newState;
    }

    default:
      return state;
  }
};
