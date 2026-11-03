import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap" style={{ padding: "96px 16px" }}>
      <p className="kicker">404</p>
      <h1>No published record here</h1>
      <p className="lede">The record may not exist, or may not have passed review for publication.</p>
      <Link href="/cases" className="btn btn--primary">
        Back to the case database
      </Link>
    </div>
  );
}
