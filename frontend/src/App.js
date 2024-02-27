import { Backdrop, CircularProgress } from "@mui/material";
import "./App.css";
import { useContext } from "react";
import { ActionContext } from "./context/ActionContext";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Patients from "./components/patients/Patients";
import Footer from "./components/footer/Footer";
import Home from "./components/home/Home";
import Diagnosis from "./components/diagnosis/Diagnosis";
import Procedure from "./components/procedure/Procedure";
import MySavedCodes from "./components/mySavedCodes/MySavedCodes";
import CodesBySpeciality from "./components/codesBySpeciality/CodesBySpeciality";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
// '/node_modules/bootstrap/dist/css/bootstrap.min.css'
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
function App() {
  const { backDropOpen } = useContext(ActionContext);

  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        { index: true, element: <Navigate to="/patients" replace /> },

        {
          path: "patients",
          element: <Patients />,
        },
      ],
    },
    {
      path: "understandingcoding",
      element: <Footer />,
    },
    {
      path: "mysavedcodes",
      element: <MySavedCodes />,
    },
    {
      path: "codespeciality",
      element: <CodesBySpeciality/>,
    },
    {
      path: "patients/:patientId",
      element: <Home />,

      children: [
        { index: true, element: <Navigate to="./diagnosis" replace /> },
        {
          path: "diagnosis",

          children: [
            { index: true, element: <Navigate to="./view" replace /> },
            { path: "view", element: <Diagnosis /> },
            {
              path: "edit",
              element: <Diagnosis />,
            },
          ],
        },
        {
          path: "procedure/NHS",
          children: [
            { index: true, element: <Navigate to="./view" replace /> },
            {
              path: "view",
              element: <Procedure />,
            },
            {
              path: "edit",
              element: <Procedure />,
            },
          ],
        },
        {
          path: "procedure/private",
          children: [
            { index: true, element: <Navigate to="./view" replace /> },
            {
              path: "view",
              element: <Procedure />,
            },
            {
              path: "edit",
              element: <Procedure />,
            },
          ],
        },
      ],
    },
  ]);
  return (
    <div className="App">
      <RouterProvider router={router} />

      <Backdrop
        sx={{ color: "#fff",backdropFilter:'blur(5px)',zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backDropOpen}
      >
        <CircularProgress thickness={4} />
      </Backdrop>
      <Outlet></Outlet>
    </div>
  );
}

export default App;
