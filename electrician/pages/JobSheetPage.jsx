import React, { useState, useEffect } from 'react';
import { PlusCircle, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
    const [labour, setLabour] = useState([
        { description: '', hours: '' },
        { description: '', hours: '' }
    ]);
    const [materials, setMaterials] = useState([
        { description: '', qty: '', cost: '' },
        { description: '', qty: '', cost: '' }
    ]);
    const navigate = useNavigate();

    // Load saved data from localStorage
    useEffect(() => {
        const savedFormData = JSON.parse(localStorage.getItem('jobSheetFormData'));
        const savedLabour = JSON.parse(localStorage.getItem('jobSheetLabour'));
        const savedMaterials = JSON.parse(localStorage.getItem('jobSheetMaterials'));
        const savedElectricianInfo = JSON.parse(localStorage.getItem('electricianInfo'));

        // Initialize form data with electrician info if it exists
        const initialFormData = {
            ...defaultFormData,
            electricianName: savedElectricianInfo?.name || '',
            electricianSignature: savedElectricianInfo?.signature || '',
        };

        if (savedFormData) {
            // Merge saved form data with electrician info
            setFormData({
                ...savedFormData,
                electricianName: savedElectricianInfo?.name || '',
                electricianSignature: savedElectricianInfo?.signature || '',
            });
        } else {
            setFormData(initialFormData);
        }
        if (savedLabour) setLabour(savedLabour);
        if (savedMaterials) setMaterials(savedMaterials);
    }, []);

    // Auto-save every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            localStorage.setItem('jobSheetFormData', JSON.stringify(formData));
            localStorage.setItem('jobSheetLabour', JSON.stringify(labour));
            localStorage.setItem('jobSheetMaterials', JSON.stringify(materials));
            
            // Save electrician info separately
            if (formData.electricianName || formData.electricianSignature) {
                localStorage.setItem('electricianInfo', JSON.stringify({
                    name: formData.electricianName,
                    signature: formData.electricianSignature
                }));
            }
        }, 3000);
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
        // Generate a unique ID for this job sheet
        const jobSheetId = `jobSheet_${Date.now()}`;
        
        // Save the complete job sheet data
        localStorage.setItem(jobSheetId, JSON.stringify({
            formData,
            labour,
            materials
        }));

        // Generate the PDF
        generatePDF(formData, labour, materials);
    };

    const handleNewJobSheet = () => {
        const currentNo = parseInt(localStorage.getItem('dayWorkSheetNo') || '4000');
        const nextNo = currentNo + 1;
        localStorage.setItem('dayWorkSheetNo', nextNo.toString());

        // Get saved electrician info
        const savedElectricianInfo = JSON.parse(localStorage.getItem('electricianInfo'));

        // Create new form data, preserving only electrician info and day work number
        const resetForm = {
            ...defaultFormData,
            dayWorkSheetNo: nextNo.toString(),
            electricianName: savedElectricianInfo?.name || '',
            electricianSignature: savedElectricianInfo?.signature || '',
        };

        setFormData(resetForm);
        setLabour([{ description: '', hours: '' }, { description: '', hours: '' }]);
        setMaterials([{ description: '', qty: '', cost: '' }, { description: '', qty: '', cost: '' }]);

        // Save the new form data
        localStorage.setItem('jobSheetFormData', JSON.stringify(resetForm));
        localStorage.setItem('jobSheetLabour', JSON.stringify([{ description: '', hours: '' }, { description: '', hours: '' }]));
        localStorage.setItem('jobSheetMaterials', JSON.stringify([{ description: '', qty: '', cost: '' }, { description: '', qty: '', cost: '' }]));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-6 sm:px-8 lg:px-8">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-4 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-semibold text-gray-800">Job Sheet Form</h1>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/job-sheets')}
                            className="flex items-center gap-2 bg-gray-100 text-gray-900 font-semibold py-2 px-4 rounded-lg shadow hover:bg-gray-200 focus:outline-none transition"
                        >
                            <List className="w-5 h-5" />
                            View Job Sheets
                        </button>
                        <button
                            type="button"
                            onClick={handleNewJobSheet}
                            className="flex items-center gap-2 bg-blue-100 text-blue-900 font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-200 focus:outline-none transition"
                        >
                            <PlusCircle className="w-5 h-5" />
                            New Job Sheet
                        </button>
                    </div>
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
