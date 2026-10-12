# Diet Mobile App

A mobile-first web application (React) for the **Hospital Diet Management System**. It is used by ward and canteen staff to take diet orders to the bedside, mark meal deliveries to patients, and collect or refund diet-related payments.

## Features

- **Secure login** – token-based authentication with protected routes (`AuthProvider`, `ProtectedRoute`, `useValidateToken`).
- **Home dashboard** – navigation cards to the main modules.
- **Nursing Station** – browse nursing stations, view bed lists and open a patient's bed detail.
- **Patient Order Detail** – view a patient's diet orders, add food items, choose diet measurements and food suggestions; price, GST and discount are calculated per party type.
- **Delivery Marking** – filter patients by delivery status, view food items per patient, mark items as delivered or missing, and review packet details (packet number, barcode printed, packet status).
- **Diet Payments** – choose a payment method and see a payment success page.
- **Cash Collection** – collect payments, choose payment modes, view summary and payment history, open bill details, and process cash returns/refunds.
- **Notifications** – audio alert (`pickupnofication.mp3`) and toast messages (`react-toastify`).

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | React 19, Create React App (`react-scripts` 5) |
| Routing | React Router 6 |
| UI | MUI Material 7, MUI Joy, MUI Icons, React Icons |
| Data fetching | TanStack React Query 5, Axios |
| Utilities | date-fns, DOMPurify, html2canvas, JSZip, react-toastify, canvas-confetti |
| Testing | Jest, React Testing Library |

## Project Structure

```
Diet_Mobile_app/
├── public/                     # Static assets (favicon, logos, notification sound)
└── src/
    ├── App.js                  # Router, React Query and Auth providers
    ├── CommonData/             # Shared helpers and query hooks
    ├── Context/                # AuthProvider
    ├── SelectComponents/       # Reusable select inputs
    ├── components/             # Shared UI components (buttons, inputs, loaders, ...)
    ├── hooks/                  # useAuth, useValidateToken
    ├── routes/                 # ProtectedRoute, RoootLayouts
    ├── Style/                  # Global styles
    └── Views/
        ├── Home/                   # Dashboard and navigation cards
        ├── NursingStation/         # Station, bed list, patient bed detail
        ├── PatientOrderDetail/     # Order details and DietPayments
        ├── PatientDeliveryMarking/ # Delivery tracking and status marking
        ├── CashCollection/         # Collection, history, returns
        ├── UserAuthentication/     # Login
        ├── Constant/               # Constants and API/URL defaults (Static.js)
        ├── Plan/                   # Workflow diagram
        └── Scripts/                # Database schema and workflow SQL
```

## Application Routes

| Route | Screen |
| --- | --- |
| `/` | Root layout / entry |
| `/Home` | Home dashboard |
| `/dashboard` | Dashboard container |
| `/nsstaion` | Nursing station |
| `/bedId` | Patient bed detail |
| `/delivery` | Delivery list |
| `/deliverydetail` | Delivery marking |
| `/diet/payment` | Payment method |
| `/diet/payment/success` | Payment success |
| `/cash-collection` | Cash collection |
| `/cash-collection/modes` | Payment modes |
| `/cash-collection/summary` | Collection summary |
| `/cash-collection/history` | Payment history |
| `/cash-collection/bill/:billingId` | Bill details |
| `/cash-collection/return` | Cash return |
| `/cash-collection/return/:billingId/:paymentId` | Close a cash return |

All routes except `/` require authentication.

## Diet Workflow

The backend data model (see `src/Views/Scripts/diet_complete_workflow_explained.sql` and `Diet_Management_version2.sql`) follows this flow:

```
Patient → Diet Plan → Diet Schedule → Diet / Canteen / Extra Orders
        → Kitchen Production → Delivery Assignment → Delivery Log
        → Meal Charge / Service Ledger → Billing → Payment → Refund
```

A diagram is available at `src/Views/Plan/workflowdiagram.png`.

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- Access to the Meliora API backend

### Installation

```bash
npm install
```

### Environment Configuration

Copy `.env.example` to `.env.development` / `.env.production` (or `.env`) and set the values:

| Variable | Description |
| --- | --- |
| `REACT_APP_API_URL` | Meliora API base URL (include `/api`) |
| `REACT_APP_WS_URL` | socket.io address (same host/port as the API, without `/api`) |
| `REACT_APP_ELLIDER_API_URL` | Ellider API base URL |
| `REACT_APP_API_URL_KMC` | KMC API base URL |

All values are optional; defaults are in `src/Views/Constant/Static.js`. Only `REACT_APP_*` variables reach the browser, so never put secrets here. Use `https://` URLs in production so passwords and payment data are not sent in clear text.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Runs the app in development at [http://localhost:3000](http://localhost:3000) |
| `npm test` | Runs the tests in watch mode |
| `npm run build` | Creates an optimized production build in `build/` |
| `npm run eject` | Ejects from Create React App (one-way) |

## Deployment

Run `npm run build` and serve the `build/` folder from any static web server. Configure the server to fall back to `index.html` so client-side routes work.

## Learn More

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://react.dev/)
