import React from 'react';

const TextInput = ({ label, name, value, onChange, placeholder }) => (
    <div className="mb-4">
        <label className="block text-gray-700 mb-1">{label}</label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full border border-gray-300 p-2 rounded"
        />
    </div>
);

export default TextInput;
