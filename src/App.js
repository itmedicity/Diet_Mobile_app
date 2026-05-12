import React, { lazy, Suspense, useLayoutEffect } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from './routes/ProtectedRoute';
import CustomBackDropWithOutState from "./components/CustomBackDropWithOutState";
import ErrorElement from "./Views/Pages/ErrorElement";
import RoootLayouts from "./routes/RoootLayouts";
import { AuthProvider } from "./Context/AuthProvider";
import NursingStation from "./Views/NursingStation/NursingStation";
import PatientBedDetail from "./Views/NursingStation/PatientBedDetail";
import DeliveryMarkingContainer from "./Views/PatientDeliveryMarking/DeliveryMarkingContainer";
import ParentComponent from "./Views/Home/ParentComponent";
import Delivery from "./Views/PatientDeliveryMarking/Delivery";

const Home = lazy(() => import("./Views/Home/Home"))

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Suspense fallback={<div >Loading</div>}> <RoootLayouts /></Suspense>,
    children: [],
    errorElement: <ErrorElement />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/Home",
        element: <Home />,
      },
      {
        path: "/delivery",
        element: <Delivery />,
      },
      {
        path: "/dashboard",
        element: <ParentComponent />,
      },
      {
        path: "/nsstaion",
        element: <NursingStation />,
      },
      {
        path: "/bedId",
        element: <PatientBedDetail />,
      },
      {
        path: "/deliverydetail",
        element: <DeliveryMarkingContainer />,
      },
    ],
    errorElement: <ErrorElement />,
  },
]);

const queryClient = new QueryClient();

function App() {

  useLayoutEffect(() => {
    document.body.classList.add("light");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <AuthProvider>
        <Suspense fallback={<CustomBackDropWithOutState message={"Loading..."} />}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={routes} />
          </QueryClientProvider>
        </Suspense>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
