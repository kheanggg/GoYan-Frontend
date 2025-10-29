'use client';

export default function Radio({ selected, onClick, error }) {
  return (
    <div
      onClick={onClick}
      className="relative w-4 h-4 flex-none cursor-pointer"
    >
      {/* Outer circle */}
      <div
        className={`absolute inset-0 rounded-full flex items-center justify-center transition-all duration-200
          ${error
            ? 'border-2 border-red-500'
            : selected
            ? 'border-4 border-primary'
            : 'border-2 border-gray-400'}
        `}
      >
      </div>
    </div>
  );
}