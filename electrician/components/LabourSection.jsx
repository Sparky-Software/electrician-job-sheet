import React from 'react';

const LabourSection = ({ labour, handleLabourChange, addLabourRow }) => (
    <div>
        <h2 className="text-xl font-bold mt-6">Labour</h2>
        {labour.map((row, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 mt-2">
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={row.description}
                    onChange={(e) => handleLabourChange(index, e)}
                    className="border border-gray-300 p-2 rounded"
                />
                <input
                    type="number"
                    name="hours"
                    placeholder="Hours"
                    value={row.hours}
                    onChange={(e) => handleLabourChange(index, e)}
                    className="border border-gray-300 p-2 rounded"
                />
            </div>
        ))}
        <button
            type="button" // Prevents form submission
            onClick={(e) => {
                e.preventDefault(); // Prevents default button action
                addLabourRow();
            }}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
            Add Labour Row
        </button>
    </div>
);

export default LabourSection;
