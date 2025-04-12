import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, FileText } from 'lucide-react';
import generatePDF from '../utils/pdfGenerator';

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

    const handleViewPDF = (jobSheet) => {
        generatePDF(jobSheet.formData, jobSheet.labour, jobSheet.materials);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-8 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">Previous Job Sheets</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                    >
                        New Job Sheet
                    </button>
                </div>

                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sheet No</th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {jobSheets.map((sheet) => (
                                    <tr key={sheet.id} className="hover:bg-gray-50">
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {sheet.formData.dayWorkSheetNo}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {sheet.formData.customer}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {sheet.formData.date}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex space-x-4">
                                                <button
                                                    onClick={() => handleViewPDF(sheet)}
                                                    className="text-green-600 hover:text-green-900 p-1"
                                                    title="View PDF"
                                                >
                                                    <FileText className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(sheet)}
                                                    className="text-blue-600 hover:text-blue-900 p-1"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(sheet.id)}
                                                    className="text-red-600 hover:text-red-900 p-1"
                                                    title="Delete"
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
        </div>
    );
};

export default JobSheetsListPage; 