// src/components/NavBar.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

type Props = { visible: boolean; finalSize?: { w: number; h: number } };

const sections = ["Home", "Events", "Gallery", "Pricing", "Team", "Equipment", "About", "Contact"];

function isAdminUser(user: any): boolean {
  if (!user) return false;
  const roles: string[] = user.roles || user.authorities || [];
  return (
    roles.includes("ADMIN") ||
    roles.includes("ROLE_ADMIN") ||
    roles.includes("ROLE_SUPER_ADMIN")
  );
}

export default function NavBar({ visible, finalSize = { w: 160, h: 48 } }: Props) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const admin = isAdminUser(user);
  const userLabel =
    (user as any)?.email ||
    (user as any)?.name ||
    "Signed in";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function goLogin() {
    setOpen(false);
    nav("/login");
  }

  function goBookings() {
    setOpen(false);
    nav("/bookings");
  }

  function goAdmin() {
    setOpen(false);
    nav("/admin");
  }

  async function doLogout() {
    setOpen(false);
    await logout();
    nav("/");
  }

  return (
    <nav
      className={`sticky top-0 z-30 w-full border-b border-zinc-900/80 backdrop-blur
                  transition-all duration-300
                  ${scrolled ? "bg-black/90" : "bg-black/70"}
                  ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* LEFT: logo dock for intro */}
          <div
            id="auric-dock"
            style={{
              width: finalSize.w,
              height: finalSize.h,
              position: "relative",
              transform: "translateZ(0)",
            }}
          />

          {/* CENTER: main nav (desktop) */}
          <ul className="hidden md:flex items-center gap-6 text-sm">
            {sections.map((label) => (
              <li key={label}>
                <a
                  href={label === "Home" ? "#" : `#${label.toLowerCase()}`}
                  className="text-amber-300/80 hover:text-amber-200 transition-colors relative
                             after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-amber-400
                             hover:after:w-full after:transition-all"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* RIGHT: auth / actions (desktop) */}
          <div className="hidden md:flex items-center gap-3 text-xs">
            {user && (
              <button
                type="button"
                onClick={goBookings}
                className="rounded-full border border-yellow-500/60 px-3 py-1 text-yellow-200 hover:bg-yellow-500/10 transition"
              >
                My bookings
              </button>
            )}

            {user && admin && (
              <button
                type="button"
                onClick={goAdmin}
                className="rounded-full border border-emerald-500/70 px-3 py-1 text-emerald-300 hover:bg-emerald-500/10 transition"
              >
                Admin
              </button>
            )}

            {user ? (
              <>
                <div className="max-w-[200px] truncate rounded-full border border-yellow-500/40 bg-black/60 px-3 py-1 text-[11px] text-yellow-100">
                  {userLabel}
                </div>
                <button
                  type="button"
                  onClick={doLogout}
                  className="rounded-full border border-zinc-700 px-3 py-1 text-zinc-200 hover:border-yellow-400 hover:text-yellow-200 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={goLogin}
                className="rounded-full border border-yellow-500 px-3 py-1 text-yellow-200 hover:bg-yellow-500/10 transition"
              >
                Login
              </button>
            )}
          </div>

          {/* MOBILE: hamburger */}
          <button
            type="button"
            className="md:hidden rounded-lg border border-zinc-700 px-3 py-1 text-xs text-amber-200"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>
        </div>
      </div>

      {/* MOBILE drawer */}
      {open && (
        <div className="md:hidden border-t border-zinc-800 bg-black/95 px-4 pb-4 pt-2 space-y-3">
          <div className="flex flex-col gap-2 text-sm">
            {sections.map((label) => (
              <a
                key={label}
                href={label === "Home" ? "#" : `#${label.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="py-1.5 text-amber-300/90 hover:text-amber-100"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-800 mt-2 space-y-2 text-xs">
            {user && (
              <button
                type="button"
                onClick={goBookings}
                className="w-full rounded-full border border-yellow-500/60 px-3 py-2 text-yellow-200 hover:bg-yellow-500/10 transition"
              >
                My bookings
              </button>
            )}
            {user && admin && (
              <button
                type="button"
                onClick={goAdmin}
                className="w-full rounded-full border border-emerald-500/70 px-3 py-2 text-emerald-300 hover:bg-emerald-500/10 transition"
              >
                Admin
              </button>
            )}

            {user ? (
              <>
                <p className="truncate text-yellow-200 text-[11px]">
                  {userLabel}
                </p>
                <button
                  type="button"
                  onClick={doLogout}
                  className="w-full rounded-full border border-zinc-700 px-3 py-2 text-zinc-200 hover:border-yellow-400 hover:text-yellow-200 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={goLogin}
                className="w-full rounded-full border border-yellow-500 px-3 py-2 text-yellow-200 hover:bg-yellow-500/10 transition"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
