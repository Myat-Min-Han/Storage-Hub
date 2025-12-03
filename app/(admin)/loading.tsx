export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.2s]"></span>
        <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.1s]"></span>
        <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce"></span>
      </div>
    </div>
  );
}