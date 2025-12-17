interface StatusProps  {
  title: string;
  value: number;
  isCurrency?: boolean;
};

export default function TrendingStatus({ title, value, isCurrency }: StatusProps) {
  return (
    <div className="text-center flex flex-col gap-2">
      <h1 className="text-sm sm:text-lg font-semibold text-gray-700">{title}</h1>
      <p className="text-blue-600 text-sm sm:text-2xl font-bold">
        {isCurrency ? value.toFixed(2) : value}
      </p>
    </div>
  );
}