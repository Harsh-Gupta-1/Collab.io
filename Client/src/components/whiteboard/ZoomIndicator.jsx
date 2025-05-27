export function ZoomIndicator({ zoom }) {
  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-sm border border-gray-200 px-3 py-1 text-sm text-gray-600 z-20">
      {Math.round(zoom * 100)}%
    </div>
  );
}
