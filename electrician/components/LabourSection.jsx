import React from 'react';

const LabourSection = ({ labour, handleLabourChange, addLabourRow }) => (
    <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Labour</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="py-2 text-left text-sm font-semibold text-gray-600 border-b w-3/4 px-2">Description</th>
                        <th className="py-2 text-left text-sm font-semibold text-gray-600 border-b w-1/4 px-2">Hours</th>
                    </tr>
                </thead>
                <tbody>
                    {labour.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="py-2 border-b px-2">
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Enter description"
                                    value={row.description}
                                    onChange={(e) => handleLabourChange(index, e)}
                                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </td>
                            <td className="py-2 border-b px-2">
                                <input
                                    type="number"
                                    name="hours"
                                    placeholder="0"
                                    value={row.hours}
                                    onChange={(e) => handleLabourChange(index, e)}
                                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                addLabourRow();
            }}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
            Add Labour Row
        </button>
    </div>
);

export default LabourSection;
