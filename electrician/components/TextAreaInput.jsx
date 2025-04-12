// TextareaInput.js
import React from 'react';

const TextareaInput = ({ label, name, value, onChange, placeholder, rows = 4 }) => (
    <div className="mb-4">
        <label className="block text-gray-700 mb-1">{label}</label>
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="w-full border border-gray-300 p-2 rounded"
        />
    </div>
);

export default TextareaInput;
