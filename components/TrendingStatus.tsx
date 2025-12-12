interface StatusProps  {
  title: string;
  value: number;
  trend: {
    diff: number;
    isUp: boolean;
    isDown: boolean;
  };
  isCurrency?: boolean;
};

export default function TrendingStatus({ title, value, trend, isCurrency }: StatusProps) {
  return (
    <div className="text-center flex flex-col gap-2">
      <h1 className="text-sm sm:text-lg font-semibold text-gray-700">{title}</h1>
      <p className="text-blue-600 text-sm sm:text-2xl font-bold">
        {isCurrency ? value.toFixed(2) : value}
      </p>
      <div className="flex gap-2 justify-center items-center">
        {trend.isUp && <small className="text-green-700">+{isCurrency ? trend.diff.toFixed(2) : trend.diff}</small>}
        {trend.isDown && <small className="text-red-700">{isCurrency ? trend.diff.toFixed(2) : trend.diff}</small>}
      </div>
    </div>
  );
}