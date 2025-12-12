import db from '@/src';
import { productsTable } from '@/src/db/schema';
import { desc, sql } from 'drizzle-orm';
import { getTrend } from '@/lib/services';
import { stackServerApp } from "@/stack/server";
import { PieChartBox } from '@/components/PieChartBox';
import TrendingStatus from '@/components/TrendingStatus';
import AreaChartBox from '@/components/AreaChartBox';
import { last6daysProducts } from "@/lib/actions";

export default async function DashboardPage() {

    await stackServerApp.getUser({ or: 'redirect' });
 
    const [ lastProducts, totalProducts, yesterdayProducts ] = await Promise.all([
        db.select().from(productsTable).orderBy(desc(productsTable.createdAt)).limit(5),
        db.select().from(productsTable),
        db.select().from(productsTable).where(sql`${productsTable.createdAt} = CURRENT_DATE - interval '1 day'`) // last 24h
    ]);

    const lowProducts = totalProducts.filter(product => product.quantity! <= 5); 
    const totalProductsValue: number = totalProducts.reduce((a, product) =>  a + product.price, 0);

    // yesterday's values
    const prevTotalProductsValue: number = yesterdayProducts.reduce((a, p) => a + p.price, 0);
    const prevLowProducts = yesterdayProducts.filter(p => p.quantity! <= 5);
    const prevTotalProductsLength: number = yesterdayProducts.length;

    const productTrend = getTrend(totalProducts.length, prevTotalProductsLength)
    const valueTrend = getTrend(totalProductsValue, prevTotalProductsValue);
    const lowTrend = getTrend(lowProducts.length, prevLowProducts.length);

    const chartData = last6daysProducts();

    return (
        <section className="min-h-screen bg-gray-50 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                {/* Left Column */}
                <div className="flex flex-col gap-5">
                    <div className="rounded-lg bg-white p-2 sm:p-5 grid grid-cols-3 gap-4 shadow-md">
                        <TrendingStatus 
                            title='Total Products'
                            value={totalProducts.length}
                            trend={productTrend}
                        />
                        <TrendingStatus 
                            title='Total Values'
                            value={totalProductsValue}
                            trend={valueTrend}
                            isCurrency
                        />
                        <TrendingStatus 
                            title='Low Stocks'
                            value={lowProducts.length}
                            trend={lowTrend}
                        />
                    </div>

                    <div className="rounded-lg p-4 bg-white shadow-md">
                        <ul className='flex flex-col gap-3'>
                            {/* 
                                q >= 50 --> green
                                q < 50 && q > 5 --> orange
                                q =< 5 --> red
                            */}
                            <p className='text-gray-400 font-semibold text-lg mb-3'>Latest Products</p>
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
                    <div className='rounded-lg shadow-md'>
                        <AreaChartBox data={chartData}/>
                    </div>
                    <div className='rounded-lg shadow-md bg-white'>
                        <PieChartBox 
                            highCount={totalProducts.length - lowProducts.length}
                            lowCount={lowProducts.length}
                            totalProducts={totalProducts.length}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}