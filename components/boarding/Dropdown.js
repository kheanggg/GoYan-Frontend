"use client";

import { useState, useRef, useEffect } from 'react';
import { ChevronRight, MapPin  } from 'lucide-react';

export default function Dropdown({ options, value, onChange, placeholder, icon: Icon, error }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Selected Value */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className={`w-full bg-primary-foreground rounded-lg p-3 text-left flex justify-between items-center
                     ${error ? 'border-2 border-red-500 text-red-500' : 'text-gray-500'}
                    `}
                >
                <span className="flex items-center">
                    {Icon && <Icon className="mr-2"/>}
                    {value ? options.find(o => o.value === value)?.label : placeholder}
                </span>
                
                <span className="ml-2">
                    <ChevronRight/>
                </span>
            </button>

            {/* Dropdown List */}
            {isOpen && (
                <ul className="absolute w-full mt-1 border-2 border-gray-200 rounded-lg bg-white max-h-60 overflow-auto z-20 shadow-lg">
                    {options.map(option => (
                        <li
                            key={option.value}
                            onClick={() => { onChange(option.value); setIsOpen(false); }}
                            className={`p-3 hover:bg-primary/10 cursor-pointer text-gray-500 ${value === option.value ? 'bg-primary/20' : ''
                                }`}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}