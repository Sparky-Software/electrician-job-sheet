import React from 'react';

const MaterialsSection = ({ materials, handleMaterialsChange, addMaterialsRow }) => (
    <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Materials</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="py-2 text-left text-sm font-semibold text-gray-600 border-b w-1/2 px-2">Description</th>
                        <th className="py-2 text-left text-sm font-semibold text-gray-600 border-b w-1/4 px-2">Qty</th>
                        <th className="py-2 text-left text-sm font-semibold text-gray-600 border-b w-1/4 px-2">Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {materials.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="py-2 border-b px-2">
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Enter description"
                                    value={row.description}
                                    onChange={(e) => handleMaterialsChange(index, e)}
                                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </td>
                            <td className="py-2 border-b px-2">
                                <input
                                    type="number"
                                    name="qty"
                                    placeholder="0"
                                    value={row.qty}
                                    onChange={(e) => handleMaterialsChange(index, e)}
                                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </td>
                            <td className="py-2 border-b px-2">
                                <div className="flex items-center border border-gray-300 rounded focus-within:ring-2 focus-within:ring-blue-500">
                                    <span className="px-2 text-gray-500">£</span>
                                    <input
                                        type="number"
                                        name="cost"
                                        placeholder="0.00"
                                        value={row.cost ? row.cost.replace('£', '') : ''}
                                        onChange={(e) => {
                                            handleMaterialsChange(index, { target: { name: 'cost', value: '£' + e.target.value } });
                                        }}
                                        className="w-full p-2 border-none focus:outline-none"
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <button
            onClick={(e) => {
                e.preventDefault();
                addMaterialsRow();
            }}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
            Add Materials Row
        </button>
    </div>
);

export default MaterialsSection;
