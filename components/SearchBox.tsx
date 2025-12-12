"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SearchBox() {
    const router = useRouter();
    const [ query, setQuery ] = useState<string>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/inventory?n=" + query);
    };

    return (
        <form className="flex w-full items-center gap-2" onSubmit={handleSubmit}>
            <Input type="text" placeholder="Search your products" onChange={(e) => setQuery(e.target.value)}/>
            <Button type="submit">
                Search
            </Button>
    </form>
    )
}