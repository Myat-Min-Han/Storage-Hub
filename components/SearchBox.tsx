"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";


export default function SearchBox() {
    const router = useRouter();
    const [ query, setQuery ] = useState<string>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/inventory?n=" + query);
    };

    return (
        <form className="flex gap-2" onSubmit={handleSubmit}>
            <input 
                type="text" 
                value={query ?? ""}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your products"  
                className="px-4 py-2 rounded-lg w-full border border-black focus:border-blue-600 focus:outline-none"/>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:cursor-pointer" type="submit">
                Search
            </button>
        </form>
    )
}