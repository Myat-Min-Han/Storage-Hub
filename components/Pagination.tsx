"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {

    const router = useRouter();
    const searchParams = useSearchParams();

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString()); // construct URLSearchParams object
        params.set("page", page.toString());
        router.push(`/inventory?${params.toString()}`); // /inventory?page=*
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if(totalPages <= 7 ) {
            for(let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if(currentPage > 4) pages.push("..."); 
            const start = Math.max(2, currentPage - 1); 
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);

            if (currentPage < totalPages - 3) pages.push("…");

            pages.push(totalPages);
        };
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                disabled={currentPage <= 1}
                onClick={() => goToPage(currentPage - 1)}
                className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50 hover:cursor-pointer"
            >
                Prev
            </button>

            {getPageNumbers().map((page, idx) =>
                typeof page === "number" ? (
                    <button
                        key={idx}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-2 rounded hover:cursor-pointer ${
                        page === currentPage ? "bg-blue-600 text-white" : "bg-gray-200"
                        }`}
                    >
                        {page}
                    </button>
                ) : (
                    <span key={idx} className="px-2">
                        {page}
                    </span>
                )
            )}

            <button
                disabled={currentPage >= totalPages}
                onClick={() => goToPage(currentPage + 1)}
                className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50 hover:cursor-pointer"
            >
                Next
            </button>
        </div>
    )
}