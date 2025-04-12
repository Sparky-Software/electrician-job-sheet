import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import LabourSection from '../components/LabourSection';
import MaterialsSection from '../components/MaterialsSection';
import SignatureSection from '../components/SignatureSection';
import DetailsSection from '../components/DetailsSection';
import generatePDF from '../utils/pdfGenerator';

const defaultFormData = {
    dayWorkSheetNo: '',
    jobNo: '',
    customer: '',
    siteAddress: '',
    areaOfWorks: '',
    worksCompleted: '',
    customerName: '',
    electricianName: '',
    customerSignature: '',
    electricianSignature: '',
    date: '',
};

const JobSheetPage = () => {
    const [formData, setFormData] = useState(defaultFormData);
    const [labour, setLabour] = useState([{ description: '', hours: '' }]);
    const [materials, setMaterials] = useState([{ description: '', qty: '', cost: '' }]);

    // Load saved data from localStorage
    useEffect(() => {
        const savedFormData = JSON.parse(localStorage.getItem('jobSheetFormData'));
        const savedLabour = JSON.parse(localStorage.getItem('jobSheetLabour'));
        const savedMaterials = JSON.parse(localStorage.getItem('jobSheetMaterials'));

        if (savedFormData) setFormData(savedFormData);
        if (savedLabour) setLabour(savedLabour);
        if (savedMaterials) setMaterials(savedMaterials);
    }, []);

    // Auto-save every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            localStorage.setItem('jobSheetFormData', JSON.stringify(formData));
            localStorage.setItem('jobSheetLabour', JSON.stringify(labour));
            localStorage.setItem('jobSheetMaterials', JSON.stringify(materials));
        }, 5000);
        return () => clearInterval(interval);
    }, [formData, labour, materials]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLabourChange = (index, e) => {
        const updatedLabour = [...labour];
        updatedLabour[index][e.target.name] = e.target.value;
        setLabour(updatedLabour);
    };

    const handleMaterialsChange = (index, e) => {
        const updatedMaterials = [...materials];
        updatedMaterials[index][e.target.name] = e.target.value;
        setMaterials(updatedMaterials);
    };

    const addLabourRow = () => {
        setLabour([...labour, { description: '', hours: '' }]);
    };

    const addMaterialsRow = () => {
        setMaterials([...materials, { description: '', qty: '', cost: '' }]);
    };

    const handleSubmit = () => {
        generatePDF(formData, labour, materials);

        localStorage.setItem('jobSheetFormData', JSON.stringify(formData));
        localStorage.setItem('jobSheetLabour', JSON.stringify(labour));
        localStorage.setItem('jobSheetMaterials', JSON.stringify(materials));

        // Do not increment here anymore — only on New Job Sheet
    };

    const handleNewJobSheet = () => {
        const currentNo = parseInt(localStorage.getItem('dayWorkSheetNo') || '4000');
        const nextNo = currentNo + 1;
        localStorage.setItem('dayWorkSheetNo', nextNo.toString());

        const resetForm = {
            ...defaultFormData,
            dayWorkSheetNo: nextNo.toString(),
        };

        setFormData(resetForm);
        setLabour([{ description: '', hours: '' }]);
        setMaterials([{ description: '', qty: '', cost: '' }]);

        localStorage.setItem('jobSheetFormData', JSON.stringify(resetForm));
        localStorage.setItem('jobSheetLabour', JSON.stringify([{ description: '', hours: '' }]));
        localStorage.setItem('jobSheetMaterials', JSON.stringify([{ description: '', qty: '', cost: '' }]));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-8">
                <h1 className="text-3xl font-semibold text-center text-gray-800 mb-4">Job Sheet Form</h1>

                <div className="flex justify-center mb-6">
                    <button
                        type="button"
                        onClick={handleNewJobSheet}
                        className="flex items-center gap-2 bg-blue-100 text-blue-900 font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-200 focus:outline-none transition"
                    >
                        <PlusCircle className="w-5 h-5" />
                        New Job Sheet
                    </button>
                </div>

                <form>
                    <DetailsSection formData={formData} handleChange={handleChange} />
                    <LabourSection labour={labour} handleLabourChange={handleLabourChange} addLabourRow={addLabourRow} />
                    <MaterialsSection
                        materials={materials}
                        handleMaterialsChange={handleMaterialsChange}
                        addMaterialsRow={addMaterialsRow}
                    />
                    <SignatureSection formData={formData} handleChange={handleChange} setFormData={setFormData} />

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none transition"
                        >
                            Generate PDF
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobSheetPage;
