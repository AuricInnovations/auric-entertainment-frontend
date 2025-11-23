// src/pages/ErrorPage.tsx
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";

type ErrorPageProps = {
  statusCode?: number;
  title?: string;
  message?: string;
};

export default function ErrorPage(props: ErrorPageProps) {
  const routeError = useRouteError();

  let status = props.statusCode ?? 404;
  let title = props.title ?? "Something went wrong";
  let message =
    props.message ??
    "An unexpected error occurred. Please try again or go back to the homepage.";

  if (!props.statusCode && isRouteErrorResponse(routeError)) {
    status = routeError.status;
    title = routeError.statusText || title;
    if (routeError.data && typeof routeError.data === "string") {
      message = routeError.data;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full px-6 py-8 rounded-2xl border border-yellow-500/40 bg-black/80 shadow-[0_0_40px_rgba(0,0,0,0.9)] text-center text-zinc-100">
        <p className="text-xs uppercase tracking-[0.25em] text-yellow-400/80 mb-2">
          Auric Entertainment
        </p>

        <div className="text-5xl font-bold text-yellow-400 mb-2">{status}</div>

        <h1 className="text-xl font-semibold mb-2">{title}</h1>

        <p className="text-sm text-zinc-300 mb-6">{message}</p>

        <div className="flex justify-center gap-3 text-sm">
          <Link
            to="/"
            className="px-4 py-2 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition"
          >
            Back to home
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-full border border-yellow-500/60 text-yellow-300 hover:bg-yellow-500/10 transition"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
