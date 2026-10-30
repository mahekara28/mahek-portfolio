export function DesktopRest({ id = "main" }: { id?: string }) {
  return (
    <main id={id} className="md-empty" tabIndex={-1}>
      <p className="md-rest-label">A BUILDER’S DESKTOP</p>
      <h1>Mahek Ara</h1>
      <p>Open an app to explore.</p>
    </main>
  );
}
