import React, { useRef, useState, useEffect } from 'react';
import SignaturePad from 'react-signature-canvas';  // Import react-signature-canvas

const SignatureCapture = ({ label, namePrefix, formData, setFormData }) => {
    const [method, setMethod] = useState('draw'); // draw | upload
    const sigPadRef = useRef();

    // Add useEffect to initialize signature when component mounts or formData changes
    useEffect(() => {
        if (sigPadRef.current) {
            if (formData[`${namePrefix}Signature`]) {
                const img = new Image();
                img.src = formData[`${namePrefix}Signature`];
                img.onload = () => {
                    sigPadRef.current.fromDataURL(formData[`${namePrefix}Signature`]);
                };
            } else {
                // Clear the signature pad if the signature data is empty
                sigPadRef.current.clear();
            }
        }
    }, [formData[`${namePrefix}Signature`], namePrefix]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, [`${namePrefix}Signature`]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const clearSignature = () => {
        sigPadRef.current.clear();
        setFormData(prev => ({ ...prev, [`${namePrefix}Signature`]: '' }));
    };

    const saveDrawnSignature = () => {
        const dataURL = sigPadRef.current.getCanvas().toDataURL('image/png');
        setFormData(prev => ({ ...prev, [`${namePrefix}Signature`]: dataURL }));
    };

    return (
        <div className="border rounded-lg space-y-4 w-full mt-4">
            <div className="p-4">
                <h3 className="text-xl font-semibold mb-4">{label}</h3>

                <input
                    type="text"
                    placeholder={label.includes('Electrician') ? 'Electrician name' : 'Customer name'}
                    value={formData[`${namePrefix}Name`]}
                    onChange={(e) =>
                        setFormData(prev => ({ ...prev, [`${namePrefix}Name`]: e.target.value }))
                    }
                    className="border border-gray-300 p-2 rounded-md w-full mb-4"
                />

                <p className="text-sm text-gray-500 mb-4">Choose a method to add your signature:</p>

                <div className="flex gap-4 mb-4">
                    <button
                        type="button"
                        onClick={() => setMethod('draw')}
                        className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Draw
                    </button>
                    <button
                        type="button"
                        onClick={() => setMethod('upload')}
                        className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Upload
                    </button>
                </div>
            </div>

            {method === 'draw' && (
                <div className="px-4 pb-4">
                    <SignaturePad
                        ref={sigPadRef}
                        canvasProps={{
                            className: 'border w-full h-64 rounded-md touch-none',
                            style: { touchAction: 'none' }
                        }}
                        onEnd={saveDrawnSignature}
                        clearOnResize={false}
                        velocityFilterWeight={0.7}
                        minWidth={1.5}
                        maxWidth={2.5}
                        dotSize={1.5}
                        penColor="black"
                        backgroundColor="white"
                    />
                    <div className="mt-4 flex items-center justify-center">
                        <button
                            type="button"
                            onClick={clearSignature}
                            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}

            {method === 'upload' && (
                <div className="px-4 pb-4">
                    <label className="block">
                        <span className="sr-only">Choose signature file</span>
                        <div className="flex flex-col items-center justify-center w-full">
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10 w-full">
                                <div className="text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                                    </svg>
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                        >
                                            <span>Upload a file</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                className="sr-only"
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>
                    </label>
                </div>
            )}
        </div>
    );
};

const SignatureSection = ({ formData, setFormData }) => {
    useEffect(() => {
        if (!formData.date) {
            const today = new Date().toISOString().split('T')[0];
            setFormData(prev => ({ ...prev, date: today }));
        }
    }, [formData, setFormData]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col space-y-6">
                <SignatureCapture
                    label="Customer Signature"
                    namePrefix="customer"
                    formData={formData}
                    setFormData={setFormData}
                />
            </div>
            <div className="flex flex-col space-y-6">
                <SignatureCapture
                    label="Electrician Signature"
                    namePrefix="electrician"
                    formData={formData}
                    setFormData={setFormData}
                />
            </div>

            <div>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                    className="border border-gray-300 p-2 rounded-md w-full"
                />
            </div>
        </div>
    );
};

export default SignatureSection;
