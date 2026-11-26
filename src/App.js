import React, { lazy, Suspense, useLayoutEffect } from "react";
import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

import ProtectedRoute from "./routes/ProtectedRoute";
import ErrorElement from "./Views/Pages/ErrorElement";
import RoootLayouts from "./routes/RoootLayouts";
import { AuthProvider } from "./Context/AuthProvider";

import PizzaLoader from "./components/PizzaLoader";

// Lazy-loaded pages
const Home = lazy(() => import("./Views/Home/Home"));
const NursingStation = lazy(() => import("./Views/NursingStation/NursingStation"));
const PatientBedDetail = lazy(() => import("./Views/NursingStation/PatientBedDetail"));
const DeliveryMarkingContainer = lazy(() => import("./Views/PatientDeliveryMarking/DeliveryMarkingContainer"));
const ParentComponent = lazy(() => import("./Views/Home/ParentComponent"));
const Delivery = lazy(() => import("./Views/PatientDeliveryMarking/Delivery"));
const PaymentMethod = lazy(() => import("./Views/PatientOrderDetail/DietPayments/PaymentMethod"));
const PaymentSuccessPage = lazy(() => import("./Views/PatientOrderDetail/DietPayments/PaymentSuccessPage"));
const CashCollection = lazy(() => import("./Views/CashCollection/CashCollection"));
const PaymentHistory = lazy(() => import("./Views/CashCollection/PaymentHistory"));
const CashCollectionSummary = lazy(() => import("./Views/CashCollection/CashCollectionSummary"));
const PaymentMode = lazy(() => import("./Views/CashCollection/PaymentMode"));
const CashCollectionBillDetails = lazy(() => import("./Views/CashCollection/CashCollectionBillDetails"));
const CashReturnDetail = lazy(() => import("./Views/CashCollection/CashReturnDetail"));
const CashReturnClosePage = lazy(() => import("./Views/CashCollection/CashReturnClosePage"));
const AssignedCashDetails = lazy(() => import("./Views/CashCollection/AssignedCashDetails"));
const CashCollectionPage = lazy(() => import("./Views/CashCollection/CashCollectionPage"));
const BatchCreationPage = lazy(() => import("./Views/BatchDetails/BatchCreationPage"));

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Suspense fallback={<PizzaLoader />}> <RoootLayouts /></Suspense>,
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
        path: "/batch",
        element: <BatchCreationPage />,
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
      {
        path: "/diet/payment",
        element: <PaymentMethod />,
      },
      {
        path: "/diet/payment/success",
        element: <PaymentSuccessPage />,
      },
      {
        path: "/cash-collection",
        element: <CashCollection />,
      },
      {
        path: "/cash-collection/modes",
        element: <PaymentMode />,
      },
      {
        path: "/cash-collection/summary",
        element: <CashCollectionSummary />,
      },
      {
        path: "/cash-collection/history",
        element: <PaymentHistory />,
      },
      {
        path: "/cash-collection/bill/:billingId",
        element: < CashCollectionBillDetails />
      },
      {
        path: "/cash-collection/return",
        element: < CashReturnDetail />
      },
      {
        path: "/cash-collection/collection",
        element: < AssignedCashDetails />
      },

      {
        path: "/cash-collection/return/:billingId/:paymentId",
        element: < CashReturnClosePage />
      },
      {
        path: "/cash-collection/collection/:billingId",
        element: < CashCollectionPage />
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
        <Suspense fallback={<PizzaLoader />}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={routes} />
          </QueryClientProvider>
        </Suspense>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
