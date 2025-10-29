'use client';

export default function ConfirmationButton({ price, onClick, disabled = false }) {

  const rawPrice = Number(price);
  const formattedPrice = Number.isFinite(rawPrice) ? rawPrice.toFixed(2) : '0.00';

  return (
    <div className="max-w-sm w-full flex justify-between items-center bg-white shadow-lg rounded-3xl">
      {/* Price */}
      <div className="m-2 mx-4 w-full flex flex-col">
        <span className="text-md text-gray-500">Subtotal</span>
        <span className="text-primary text-xl font-semibold">${formattedPrice}</span>
      </div>

      {/* Continue Button */}
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          py-5 px-6 h-full rounded-r-3xl text-white text-lg
          bg-primary hover:bg-blue-700 transition-colors duration-200
          ${disabled ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400' : ''}
        `}
      >
        Continue
      </button>
    </div>
  );
}
// 'use client';

// export default function ProceedToPaymentButton({ onClick, disabled = false }) {
//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className={`
//         w-full py-3 px-6 rounded-xl text-white shadow-sm font-semibold text-lg
//         bg-blue-600 hover:bg-blue-700 transition-colors duration-200
//         ${disabled ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400' : ''}
//       `}
//     >
//       Continue to Payment
//     </button>
//   );
// }
