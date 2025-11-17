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

export const router = createBrowserRouter([
  // Public landing → your premium App.tsx (hero + events + gallery + pricing + contact)
  {
    path: "/",
    element: <App />,
  },

  // Auth / user
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/bookings",
    element: <MyBookings />,
  },
  // Event detail
  {
    path: "/events/:id",
    element: <EventDetail />,
  },

  // Admin area
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <div>Admin dashboard coming soon</div> },
      { path: "events", element: <AdminEvents /> },
      { path: "bookings", element: <AdminBookings /> },
      { path: "gallery", element: <AdminGallery /> },      
    ],
  },
]);

export default router;
