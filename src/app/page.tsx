import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Phat's Mini Games</h1>
        <Link
          href="/undercover"
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Undercover 🕵️
        </Link>
      </div>
    </main>
  );
}
