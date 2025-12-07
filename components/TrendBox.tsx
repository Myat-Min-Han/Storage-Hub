import { TrendingUp, TrendingDown } from 'lucide-react';

interface TrendProps {
  label: string;
  current: number;
  previous: number;
  isCurrency?: boolean;
}

export default function TrendBox({ label, current, previous, isCurrency }: TrendProps) {
  const diff = current - previous;
  const isUp = diff > 0;
  const isDown = diff < 0;

  return (
    <div className="rounded-lg bg-white p-5 shadow-md flex flex-col gap-2 items-center text-center">
      <h1 className="text-sm sm:text-lg font-semibold text-gray-700">{label}</h1>
      <p className="text-blue-600 text-md sm:text-2xl font-bold">
        {isCurrency ? current.toFixed(2) : current}
      </p>
      <div className="flex gap-2 justify-center items-center">
        {isUp && (
          <>
            <TrendingUp className="w-2 h-2 sm:w-5 sm:h-5" color="green" />
            <small className="text-green-700">
              +{isCurrency ? diff.toFixed(2) : diff}
            </small>
          </>
        )}
        {isDown && (
          <>
            <TrendingDown className="w-2 h-2 sm:w-5 sm:h-5" color="red" />
            <small className="text-red-700">
              {isCurrency ? diff.toFixed(2) : diff}
            </small>
          </>
        )}
      </div>
    </div>
  );
}