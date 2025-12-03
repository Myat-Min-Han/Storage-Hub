import Link from "next/link";

export default function HomePage() {
  return (
    <section className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="text-center space-y-5">
        <h1 className="text-5xl font-semibold">Control Your Products With</h1>
        <span className="text-blue-600 text-5xl font-semibold">StorageHub</span>
        <p className="text=lg text-gray-600 mt-4">Simplify inventory management and keep track of your products in one powerful dashboard</p>
        <Link href="/handler/sign-in" className="px-4 py-3 rounded-lg bg-blue-600 text-white text-lg mr-5">
          Sign in
        </Link>
        <Link href="/dashboard" className="text-lg">
          Get Started
        </Link>
      </div>
    </section>
  )
}
