import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export default function AppLayout() {
  const { user, logout, loading } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100">
      <header className="flex items-center justify-between px-6 py-4 border-b border-yellow-700/30">
        {/* 👇 this is where the intro SVG will dock */}
        <div
          id="brand-anchor"
          className="relative h-8 flex items-center"   // 32px tall slot
          style={{ minWidth: 112 }}                    // enough space for the wordmark
        >
          <Link id="brand-fallback" to="/" className="text-yellow-400 font-bold text-xl">
            AURIC
          </Link>
        </div>

        <nav className="flex gap-6 items-center">
          <Link to="/" className="hover:text-yellow-300">Events</Link>
          {loading ? (
            <span className="text-gray-400">…</span>
          ) : user ? (
            <>
              <Link to="/bookings" className="hover:text-yellow-300">My Bookings</Link>
              <button
                onClick={logout}
                className="border border-yellow-500 px-4 py-1 rounded-lg hover:bg-yellow-500 hover:text-black"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="border border-yellow-500 px-4 py-1 rounded-lg hover:bg-yellow-500 hover:text-black"
            >
              Login
            </Link>
          )}
        </nav>
      </header>

      <main className="px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
