import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

export default function CustomDatePicker({ value, onChange, error }) {
  return (
    <div className="relative w-full">
      <DatePicker
        selected={value}
        onChange={onChange}
        placeholderText="Select a date"
        wrapperClassName="w-full" 
        className={`
          w-full bg-primary-foreground 
          rounded-lg p-3 pl-11 text-left
          ${error ? 'border-2 border-red-500 placeholder-red-500 text-red-500' : 'placeholder-gray-500 text-gray-500'}
        `}
        calendarClassName="w-full"
      />

      {/* Icon on the right */}
      <Calendar className={`absolute left-3 top-3 pointer-events-none ${error ? 'border-red-500 text-red-500' : 'border-gray-200 text-gray-500'}`} />
    </div>
  );
}