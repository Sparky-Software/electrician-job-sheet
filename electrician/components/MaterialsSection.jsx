import React from 'react';

const MaterialsSection = ({ materials, handleMaterialsChange, addMaterialsRow }) => (
    <div>
        <h2 className="text-xl font-bold mt-6">Materials</h2>
        {materials.map((row, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 mt-2">
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={row.description}
                    onChange={(e) => handleMaterialsChange(index, e)}
                    className="border border-gray-300 p-2 rounded"
                />
                <input
                    type="number"
                    name="qty"
                    placeholder="Qty"
                    value={row.qty}
                    onChange={(e) => handleMaterialsChange(index, e)}
                    className="border border-gray-300 p-2 rounded"
                />
                <div className="flex items-center border border-gray-300 p-2 rounded">
                    <span className="mr-2">£</span> {/* Pound symbol prepended here */}
                    <input
                        type="number"
                        name="cost"
                        placeholder="Cost"
                        value={row.cost ? row.cost.replace('£', '') : ''} // Remove '£' symbol before displaying the value
                        onChange={(e) => {
                            // Prepend the '£' symbol while updating the state
                            handleMaterialsChange(index, { target: { name: 'cost', value: '£' + e.target.value } });
                        }}
                        className="border-none p-2 w-full"
                    />
                </div>
            </div>
        ))}
        <button
            onClick={(e) => {
                e.preventDefault();  // Prevent page reload
                addMaterialsRow();  // Call the function to add a row
            }}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
            Add Materials Row
        </button>
    </div>
);

export default MaterialsSection;
