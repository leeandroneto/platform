export default function TweakcnTest() {
  return (
    <>
      <style>{`
        :root {
          --background: oklch(1 0 0);
          --foreground: oklch(0.145 0 0);
          --primary: oklch(0.205 0 0);
          --primary-foreground: oklch(0.985 0 0);
          --secondary: oklch(0.97 0 0);
          --secondary-foreground: oklch(0.205 0 0);
          --muted: oklch(0.97 0 0);
          --muted-foreground: oklch(0.556 0 0);
          --accent: oklch(0.97 0 0);
          --accent-foreground: oklch(0.205 0 0);
          --destructive: oklch(0.577 0.245 27.325);
          --border: oklch(0.922 0 0);
          --input: oklch(0.922 0 0);
          --ring: oklch(0.708 0 0);
          --card: oklch(1 0 0);
          --card-foreground: oklch(0.145 0 0);
          --popover: oklch(1 0 0);
          --popover-foreground: oklch(0.145 0 0);
        }
      `}</style>
      <script src="https://tweakcn.com/live-preview.min.js" />
      <div style={{ padding: 40 }}>
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: 24,
            maxWidth: 400,
          }}
        >
          <h1 style={{ color: 'var(--foreground)' }}>Página de teste</h1>
          <p style={{ color: 'var(--muted-foreground)' }}>
            Mude o tema no TweakCN e veja mudar aqui.
          </p>
          <button
            style={{
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 6,
              cursor: 'pointer',
              marginTop: 12,
            }}
          >
            Botão de exemplo
          </button>
        </div>
      </div>
    </>
  )
}
