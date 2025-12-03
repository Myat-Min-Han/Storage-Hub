import { Box, LayoutDashboard, PackageSearch, Settings, ChartBarBig } from "lucide-react";
import Link from "next/link";
import { UserButton } from "@stackframe/stack";

const navigations = [
    { name: "dashboard", href: "/dashboard", icon: <LayoutDashboard />},
    { name: "inventory", href: "/inventory", icon: <PackageSearch />},
    { name: "status", href: "/dashboard/status", icon: <ChartBarBig /> },
    { name: "setting", href: "/setting", icon: <Settings />},
]

export default function Sidebar() {
    return (
        <aside className="min-h-screen bg-gray-900 text-white w-56">
            <div className="flex gap-3 items-center p-4">
                <Box className="w-10 h-10"/>
                <h1 className="font-semibold text-xl">Storage Hub</h1>
            </div>
            <nav className="flex flex-col gap-4 p-5">
                {navigations.map((navigation, index) => (
                    <Link href={navigation.href} key={index} className="flex gap-4 hover:bg-blue-600 p-2 hover:rounded-md">
                        {navigation.icon}
                        {navigation.name}
                    </Link>
                ))}
            </nav>
            <footer className="fixed bottom-0 p-5 ">
                <UserButton showUserInfo/>
            </footer>
        </aside>
    )
}