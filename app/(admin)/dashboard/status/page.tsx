import TrendBox from "@/components/TrendBox";
import { getDailyStatus, getMonthlyStatus, getYearlyStatus } from "@/lib/services";
import { stackServerApp } from "@/stack/server";

export default async function StatusPage() {

  await stackServerApp.getUser({ or: 'redirect' })
    const daily = await getDailyStatus();
    const monthly = await getMonthlyStatus();
    const yearly = await getYearlyStatus();

    return (
    <div className="p-8 flex flex-col gap-10">
      {/* Daily Section */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Daily Status</h2>
        <div className="grid grid-cols-3 gap-4">
          <TrendBox label="Daily Products" current={daily.products.current} previous={daily.products.previous} />
          <TrendBox label="Daily Value" current={daily.value.current} previous={daily.value.previous} isCurrency />
          <TrendBox label="Daily Low Stocks" current={daily.low.current} previous={daily.low.previous} />
        </div>
      </div>

      {/* Monthly Section */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Monthly Status</h2>
        <div className="grid grid-cols-3 gap-4">
          <TrendBox label="Monthly Products" current={monthly.products.current} previous={monthly.products.previous} />
          <TrendBox label="Monthly Value" current={monthly.value.current} previous={monthly.value.previous} isCurrency />
          <TrendBox label="Monthly Low Stocks" current={monthly.low.current} previous={monthly.low.previous} />
        </div>
      </div>

      {/* Yearly Section */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Yearly Status</h2>
        <div className="grid grid-cols-3 gap-4">
          <TrendBox label="Yearly Products" current={yearly.products.current} previous={yearly.products.previous} />
          <TrendBox label="Yearly Value" current={yearly.value.current} previous={yearly.value.previous} isCurrency />
          <TrendBox label="Yearly Low Stocks" current={yearly.low.current} previous={yearly.low.previous} />
        </div>
      </div>
    </div>
  );
}
