"use client";

import { Box, LayoutDashboard, PackageSearch, Settings, ChartBarBig, Menu } from "lucide-react";
import Link from "next/link";
import { UserButton } from "@stackframe/stack";
import { useState } from "react";

const navigations = [
    { name: "dashboard", href: "/dashboard", icon: <LayoutDashboard />},
    { name: "inventory", href: "/inventory", icon: <PackageSearch />},
    { name: "status", href: "/dashboard/status", icon: <ChartBarBig /> },
    { name: "setting", href: "/setting", icon: <Settings />},
]

export default function Sidebar() {

    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    
    return (
        <>
        <aside className="min-h-screen bg-gray-900 text-white sm:w-56 hidden md:block">
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
        <div className="sm:hidden block p-2 bg-gray-50">
            <button onClick={() => setIsOpen(true)} className="p-1 rounded-md hover:bg-gray-200 cursor-pointer">
                <Menu className="w-6 h-6"/>
            </button>
        </div>
        { isOpen && (
            <aside className={`fixed top-0 left-0 h-full w-56 bg-gray-900 text-white transform 
                ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                transition-transform duration-300 ease-in-out md:hidden z-50`}
            >
                <div className="flex gap-3 items-center p-4">
                    <Box className="w-10 h-10" />
                    <h1 className="font-semibold text-xl">Storage Hub</h1>
                </div>
                <nav className="flex flex-col gap-4 p-5">
                    {navigations.map((navigation, index) => (
                        <Link
                            href={navigation.href}
                            key={index}
                            className="flex gap-4 hover:bg-blue-600 p-2 hover:rounded-md"
                            onClick={() => setIsOpen(false)} 
                        >
                            {navigation.icon}
                            {navigation.name}
                        </Link>
                    ))}
                </nav>
                <footer className="fixed bottom-0 p-5 ">
                    <UserButton showUserInfo/>
                </footer>
            </aside>
        )}
        </>
    )
}