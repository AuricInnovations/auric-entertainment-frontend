// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import MyBookings from "./pages/MyBookings";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminGallery from "./pages/admin/AdminGallery";
import EventDetail from "./pages/EventDetail";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminEventTickets from "./pages/admin/AdminEventTickets";
import ErrorPage from "./pages/ErrorPage";
import { title } from "process";


export const router = createBrowserRouter([
  // Public landing → your premium App.tsx (hero + events + gallery + pricing + contact)
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },

  // Auth / user
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/bookings",
    element: <MyBookings />,
    errorElement: <ErrorPage />,
  },
  // Event detail
  {
    path: "/events/:id",
    element: <EventDetail />,
    errorElement: <ErrorPage />,
  },


  // Admin area
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <div>Admin dashboard coming soon</div> },
      { path: "events", element: <AdminEvents /> },
      { path: "events/:eventId/tickets", element: <AdminEventTickets /> },
      { path: "bookings", element: <AdminBookings /> },
      { path: "gallery", element: <AdminGallery /> },
    ],
  },
  {
    path: "*",
    element: (
      <ErrorPage
        statusCode={404}
        title="Page not found"
        message="This route does not exist. Check the URL or go back to the homepage."
      />
    ),
  },
]);

export default router;
