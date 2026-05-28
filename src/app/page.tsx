import Link from "next/link";
import { FontSizeControl } from "@/components/font-size-control";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Phat's Mini Games</h1>
        <div className="flex justify-center">
          <FontSizeControl />
        </div>
        <div className="flex flex-col gap-2 items-center">
          <Link
            href="/undercover"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Undercover 🕵️
          </Link>
          <Link
            href="/tienlen"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Tiến Lên 🃏
          </Link>
          <Link
            href="/skyjo"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Skyjo 🎴
          </Link>
        </div>
      </div>
    </main>
  );
}
