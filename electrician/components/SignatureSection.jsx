import React, { useRef, useState, useEffect } from 'react';
import SignaturePad from 'react-signature-canvas';  // Import react-signature-canvas

const SignatureCapture = ({ label, namePrefix, formData, setFormData }) => {
    const [method, setMethod] = useState('draw'); // draw | upload | camera
    const sigPadRef = useRef();
    const videoRef = useRef();
    const canvasRef = useRef();
    const [isCameraReady, setIsCameraReady] = useState(false);

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

    const captureImage = () => {
        if (canvasRef.current && videoRef.current) {
            const context = canvasRef.current.getContext('2d');
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            const dataURL = canvasRef.current.toDataURL('image/png');
            setFormData(prev => ({ ...prev, [`${namePrefix}Signature`]: dataURL }));
        }
    };

    useEffect(() => {
        if (method === 'camera') {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                    videoRef.current.srcObject = stream;
                    setIsCameraReady(true);
                })
                .catch((err) => {
                    console.error('Error accessing camera: ', err);
                    setIsCameraReady(false);
                });
        }
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
        };
    }, [method]);

    return (
        <div className="border p-6 rounded-lg space-y-4 w-full max-w-full">
            <h3 className="text-xl font-semibold">{label}</h3>

            <input
                type="text"
                placeholder={label.includes('Electrician') ? 'Electrician name' : 'Customer name'}
                value={formData[`${namePrefix}Name`]}
                onChange={(e) =>
                    setFormData(prev => ({ ...prev, [`${namePrefix}Name`]: e.target.value }))
                }
                className="border border-gray-300 p-3 rounded-md w-full"
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
                <button
                    type="button"
                    onClick={() => { setMethod('camera'); }}
                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                    Camera
                </button>
            </div>

            {method === 'draw' && (
                <div>
                    <SignaturePad
                        ref={sigPadRef}
                        canvasProps={{
                            className: 'border w-full h-64 rounded-md',
                        }}
                        onEnd={saveDrawnSignature}
                    />
                    <div className="mt-4">
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
                <div className="mt-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                </div>
            )}

            {method === 'camera' && (
                <div>
                    <video
                        ref={videoRef}
                        autoPlay
                        className="w-full h-32 border rounded-md"
                    />
                    <canvas
                        ref={canvasRef}
                        width="640"
                        height="480"
                        className="hidden"
                    />
                    {isCameraReady && (
                        <button
                            type="button"
                            onClick={captureImage}
                            className="mt-2 text-blue-500 underline"
                        >
                            Capture
                        </button>
                    )}
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
        <div className="flex flex-col gap-6 mt-6">
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
                    className="border border-gray-300 p-3 rounded-md w-full"
                />
            </div>
        </div>
    );
};

export default SignatureSection;
