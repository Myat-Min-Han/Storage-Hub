"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import db from "@/src";
import { productsTable } from "@/src/db/schema";

export default function Chart( { data }: { data: { week: string; products: number }[] } ) {
    return (
        <div className="w-full max-w-lg mx-auto">
            <ResponsiveContainer width="100%" height={220}>
                <LineChart
                    data={data}
                    margin={{ top: 12, right: 12, left: 0, bottom: 12 }}
                >
                    <CartesianGrid strokeDasharray="5 5"/>
                    <XAxis dataKey="week"/>
                    <YAxis allowDecimals={false}/>
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="products" stroke="#3b82f6" strokeWidth={2}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}