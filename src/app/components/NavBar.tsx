import Link from "next/link";

export default function NavBar() {
  return (
    <div className="z-10 absolute top-3 left-3">
      <Link
        className="px-2 py-1 rounded bg-zinc-600 m-1 border-rose-300 border-2 hover:opacity-75 transition-all duration-200 text-rose-300"
        href="/"
      >
        🐵
      </Link>
      <Link
        className="px-2 py-1 rounded bg-zinc-600 m-1 border-rose-300 border-2 hover:opacity-75 transition-all duration-200 text-rose-300"
        href="/stars"
      >
        ⭐️
      </Link>
      <Link
        className="px-2 py-1 rounded bg-zinc-600 m-1 border-rose-300 border-2 hover:opacity-75 transition-all duration-200 text-rose-300"
        href="/joystick"
      >
        🎮
      </Link>
    </div>
  );
}
