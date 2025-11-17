import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../state/AuthContext";
import { useEffect } from "react";

function isAdminUser(user: any): boolean {
  if (!user) return false;
  const roles: string[] = user.roles || user.authorities || [];
  return (
    roles.includes("ADMIN") ||
    roles.includes("ROLE_ADMIN") ||
    roles.includes("ROLE_SUPER_ADMIN")
  );
}

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const admin = isAdminUser(user);

  // If not logged in → go to login
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-zinc-200 flex items-center justify-center">
        Checking access…
      </div>
    );
  }

  // Logged in but not admin: show access denied *inside* admin shell
  if (user && !admin) {
    return (
      <div className="min-h-screen bg-black text-zinc-100 flex items-center justify-center">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-xl font-semibold">Access denied</h1>
          <p className="text-sm text-zinc-400">
            This area is restricted to Auric admin accounts.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-2 rounded-full border border-yellow-500 px-4 py-2 text-sm text-yellow-200 hover:bg-yellow-500/10 transition"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  // At this point: logged in AND admin
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex">
      {/* sidebar */}
      <aside className="w-60 border-r border-zinc-800 bg-black/95 px-4 py-5 flex flex-col gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-yellow-300/80">
            Auric Admin
          </p>
          <p className="text-xs text-zinc-500 mt-1">Show control</p>
        </div>

        <nav className="flex-1 text-sm space-y-1">
          <NavItem to="/admin" label="Dashboard" />
          <NavItem to="/admin/events" label="Events" />
          <NavItem to="/admin/bookings" label="Bookings" />
          <NavItem to="/admin/gallery" label="Image gallery" />
        </nav>

        <div className="text-xs text-zinc-500 space-y-1">
          <p className="truncate text-yellow-200">
            {(user as any)?.email || (user as any)?.name}
          </p>
          <button
            onClick={async () => {
              await logout();
              navigate("/");
            }}
            className="mt-1 w-full rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-200 hover:border-yellow-400 hover:text-yellow-200 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* main */}
      <main className="flex-1 px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `block rounded-lg px-3 py-2 transition ${
          isActive
            ? "bg-yellow-500/15 text-yellow-200 border border-yellow-500/40"
            : "text-zinc-300 hover:bg-zinc-900 border border-transparent"
        }`
      }
    >
      {label}
    </NavLink>
  );
}
