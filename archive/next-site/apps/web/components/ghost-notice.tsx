export function GhostUnavailable({ reason }: { reason: "not-configured" | "unavailable" }) {
  return (
    <div className="empty">
      {reason === "not-configured" ? (
        <p>
          The editorial CMS is not connected. Set <span className="mono">GHOST_URL</span> and{" "}
          <span className="mono">GHOST_CONTENT_API_KEY</span> in <span className="mono">apps/web/.env.local</span>.
        </p>
      ) : (
        <p>Investigations are temporarily unavailable. Please try again shortly.</p>
      )}
    </div>
  );
}
