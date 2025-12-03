import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
    children
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <section className="flex">
            <Sidebar />
            <main className="flex-1">
                {children}
            </main>
        </section>
    )
}