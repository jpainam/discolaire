export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={
          "bg-background text-foreground min-h-screen font-sans antialiased"
        }
      >
        {props.children}
      </body>
    </html>
  );
}
