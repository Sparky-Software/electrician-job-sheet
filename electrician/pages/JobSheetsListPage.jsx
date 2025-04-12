import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';

const JobSheetsListPage = () => {
    const navigate = useNavigate();
    const [jobSheets, setJobSheets] = useState([]);

    useEffect(() => {
        // Load all saved job sheets from localStorage
        const loadJobSheets = () => {
            const sheets = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('jobSheet_')) {
                    const sheet = JSON.parse(localStorage.getItem(key));
                    sheets.push({
                        id: key,
                        ...sheet
                    });
                }
            }
            setJobSheets(sheets.sort((a, b) => b.dayWorkSheetNo - a.dayWorkSheetNo));
        };

        loadJobSheets();
    }, []);

    const handleEdit = (jobSheet) => {
        // Save the job sheet data to be loaded in the JobSheetPage
        localStorage.setItem('jobSheetFormData', JSON.stringify(jobSheet.formData));
        localStorage.setItem('jobSheetLabour', JSON.stringify(jobSheet.labour));
        localStorage.setItem('jobSheetMaterials', JSON.stringify(jobSheet.materials));
        navigate('/');
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this job sheet?')) {
            localStorage.removeItem(id);
            setJobSheets(jobSheets.filter(sheet => sheet.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6 sm:px-8 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-semibold text-gray-800">Previous Job Sheets</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        New Job Sheet
                    </button>
                </div>

                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sheet No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {jobSheets.map((sheet) => (
                                <tr key={sheet.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {sheet.formData.dayWorkSheetNo}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {sheet.formData.customer}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {sheet.formData.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(sheet)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(sheet.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default JobSheetsListPage; 