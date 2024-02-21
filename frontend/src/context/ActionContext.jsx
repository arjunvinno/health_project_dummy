import { createContext, useReducer, useState } from "react";
import { reducer } from "./ActionReducer";
import { apiReducer } from "./ApiReducer";

export const ActionContext = createContext();

export const ActionProvider = ({ children }) => {
  const [backDropOpen, setBackDropOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const handleBackDropClose = () => {
    setBackDropOpen(false);
  };

  const handleBackDropOpen = () => {
    setBackDropOpen(true);
  };

  const handleAlertOpen = () => {
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const [activeBtns, dispatch] = useReducer(reducer, {
    edit: false,
    complete: true,
  });

  const [datas, apiDispatch] = useReducer(apiReducer, {
    codes: {
      loading: false,
      data: [],
      error: {
        message: "",
      },
      success: {
        message: "",
      },
    },
    allPatients: {
      loading: false,
      data: [],
      totalCount: 0,
      error: {
        message: "",
      },
      success: {
        message: "",
      },
    },
    patient: {
      loading: false,
      data: {},
      error: {
        message: "",
      },
      success: {
        message: "",
      },
    },
    diagnosticsOnId: {
      loading: false,
      data: [],
      error: {
        message: "",
      },
      success: {
        message: "",
      },
    },
    proceduresOnId: {
      loading: false,
      data: [],
      error: {
        message: "",
      },
      success: {
        message: "",
      },
    },
  });

  const [dataRow1, setDataRow1] = useState([]);
  const [dataRow2, setDataRow2] = useState([]);
  const [dataRow3, setDataRow3] = useState([]);

  return (
    <ActionContext.Provider
      value={{
        activeBtns,
        dispatch,
        dataRow1,
        setDataRow1,
        dataRow2,
        setDataRow2,
        dataRow3,
        setDataRow3,
        datas,
        apiDispatch,
        backDropOpen,
        handleBackDropClose,
        handleBackDropOpen,
        alertOpen,
        handleAlertOpen,
        handleAlertClose,
      }}
    >
      {children}
    </ActionContext.Provider>
  );
};
