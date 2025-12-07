import Chart from '@/components/Chart';
import db from '@/src';
import { productsTable } from '@/src/db/schema';
import { desc, sql } from 'drizzle-orm';
import { getTrend } from '@/lib/services';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { getWeeklyProducts } from '@/lib/services';
import { stackServerApp } from "@/stack/server";

export default async function DashboardPage() {

    await stackServerApp.getUser({ or: 'redirect' });
 
    const [ lastProducts, totalProducts, yesterdayProducts ] = await Promise.all([
        db.select().from(productsTable).orderBy(desc(productsTable.createdAt)).limit(5),
        db.select().from(productsTable),
        db.select().from(productsTable).where(sql`${productsTable.createdAt} = CURRENT_DATE - interval '1 day'`) // last 24h
    ]);

    const lowProducts = totalProducts.filter(product => product.quantity! <= 5); 
    const highCount = totalProducts.length - lowProducts.length;

    const lowPercentage = totalProducts.length > 0 ? (lowProducts.length / totalProducts.length) * 100 : 0;
    const highPercentage = totalProducts.length > 0 ? (highCount / totalProducts.length) * 100 : 0;

    const totalProductsValue: number = totalProducts.reduce((a, product) =>  a + product.price, 0);

    // yesterday's values
    const prevTotalProductsValue: number = yesterdayProducts.reduce((a, p) => a + p.price, 0);
    const prevLowProducts = yesterdayProducts.filter(p => p.quantity! <= 5);
    const prevTotalProductsLength: number = yesterdayProducts.length;

    const productTrend = getTrend(totalProducts.length, prevTotalProductsLength)
    const valueTrend = getTrend(totalProductsValue, prevTotalProductsValue);
    const lowTrend = getTrend(lowProducts.length, prevLowProducts.length);

    const data = await getWeeklyProducts();

    return (
        <section className="min-h-screen bg-gray-50 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                {/* Left Column */}
                <div className="flex flex-col gap-5">
                    <div className="rounded-lg bg-white p-5 grid grid-cols-3 gap-4 shadow-md">
                        <div className="text-center flex flex-col gap-2">
                            <h1 className="text-sm sm:text-lg font-semibold text-gray-700">Total Products</h1>
                            <p className="text-blue-600 text-sm sm:text-2xl font-bold">{totalProducts.length || 0}</p>
                            <div className='flex gap-2 justify-center items-center'>
                               {productTrend.isUp && (
                                    <>
                                        <TrendingUp className="w-5 h-5" color="green" />
                                        <small className="text-green-700">+{productTrend.diff}</small>
                                    </>
                                )}
                                {productTrend.isDown && (
                                    <>
                                        <TrendingDown className="w-5 h-5" color="red" />
                                        <small className="text-red-700">{productTrend.diff}</small>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="text-center flex flex-col gap-2">
                            <h1 className="text-sm sm:text-lg font-semibold text-gray-700">Total Values</h1>
                            <p className="text-blue-600 text-sm sm:text-2xl font-bold">{totalProductsValue.toFixed(2)}</p>
                            <div className='flex gap-2 justify-center items-center'>
                                {valueTrend.isUp && (
                                    <>
                                        <TrendingUp className="w-5 h-5" color="green" />
                                        <small className="text-green-700">+{valueTrend.diff.toFixed(2)}</small>
                                    </>
                                )}
                                {valueTrend.isDown && (
                                    <>
                                        <TrendingDown className="w-5 h-5" color="red" />
                                        <small className="text-red-700">{valueTrend.diff.toFixed(2)}</small>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="text-center flex flex-col gap-2">
                            <h1 className="text-sm sm:text-lg font-semibold text-gray-700">Low Stocks</h1>
                            <p className="text-blue-600 text-sm sm:text-2xl font-bold">{lowProducts.length}</p>
                            <div className='flex gap-2 justify-center items-center'>
                                {lowTrend.isUp && (
                                    <>
                                        <TrendingUp className="w-5 h-5" color="green" />
                                        <small className="text-green-700">+{lowTrend.diff}</small>
                                    </>
                                )}
                                {lowTrend.isDown && (
                                    <>
                                        <TrendingDown className="w-5 h-5" color="red" />
                                        <small className="text-red-700">{lowTrend.diff}</small>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg p-4 bg-white shadow-md">
                        <ul className='flex flex-col gap-3'>
                            {/* 
                                q >= 50 --> green
                                q < 50 && q > 5 --> orange
                                q =< 5 --> red
                            */}
                            {lastProducts.map((product) => {
                                let quantityColor: string;
                                if(product.quantity! >= 50) {
                                    quantityColor = 'text-green-600';
                                } else if(product.quantity! < 50 && product.quantity! > 5) {
                                    quantityColor = 'text-orange-600';
                                } else {
                                    quantityColor = 'text-red-600';
                                };
                                
                                return (
                                    <li 
                                    key={product.id} 
                                    className='text-gray-700 bg-gray-50 rounded-md p-4 font-semibold flex justify-between items-center'
                                >
                                    {product.name}
                                    <div className={`${quantityColor}`}>{product.quantity}</div>
                                </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-5">
                    <div className="rounded-lg bg-white p-2 shadow-md">
                        <Chart data={data}/>
                    </div>
                    <div className='rounded-lg bg-white p-5 shadow-md flex  gap-8 items-center'>
                        {/* High Stocks Circle */}
                        <div className='relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40'>
                            <svg className='w-full h-full' viewBox="0 0 160 160">
                                {/* background circle */}
                                <circle 
                                    className='stroke-gray-200'
                                    strokeWidth={12}
                                    fill='none'
                                    r={70}
                                    cx={80}
                                    cy={80}
                                />
                                {/* progress circle */}
                                <circle 
                                    className='stroke-green-500'
                                    strokeWidth={12}
                                    fill='none'
                                    r={70}
                                    cx={80}
                                    cy={80}
                                    strokeDasharray={2 * Math.PI * 70}
                                    strokeDashoffset={2 * Math.PI * 70 * (1 - highPercentage / 100)}
                                    strokeLinecap='round'
                                    transform={`rotate(-90 ${80} ${80})`}
                                />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center font-bold text-sm sm:text-lg">
                                {Math.round(highPercentage)}%
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-sm sm:text-lg font-semibold text-gray-700">High Stocks</h2>
                            <p className="text-green-600 font-bold text-sm sm:text-lg">{highCount} products</p>
                        </div>

                        {/* Low Stocks Circle */}
                        <div className='relative w-24 h-24  sm:w-32 sm:h-32 md:w-40 md:h-40'>
                            <svg className='w-full h-full' viewBox="0 0 160 160">
                                <circle 
                                    className='stroke-gray-200'
                                    strokeWidth={12}
                                    fill='none'
                                    r={70}
                                    cx={80}
                                    cy={80}
                                />
                                <circle 
                                    className='stroke-red-500'
                                    strokeWidth={12}
                                    fill='none'
                                    r={70}
                                    cx={80}
                                    cy={80}
                                    strokeDasharray={2 * Math.PI * 70}
                                    strokeDashoffset={2 * Math.PI * 70 * (1 - lowPercentage / 100)}
                                    strokeLinecap='round'
                                    transform={`rotate(-90 ${80} ${80})`}
                                />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center font-bold text-sm sm:text-lg">
                                {Math.round(lowPercentage)}%
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-sm sm:text-lg font-semibold text-gray-700">Low Stocks</h2>
                            <p className="text-red-600 font-bold text-sm sm:text-lg">{lowProducts.length} products</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}