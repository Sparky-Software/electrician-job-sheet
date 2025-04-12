import { useEffect } from 'react';
import TextInput from '../components/TextInput';
import TextareaInput from '../components/TextareaInput';

const DetailsSection = ({ formData, handleChange }) => {
    // Removed the local state `dayWorkSheetNo` as it's now managed by the parent

    // On initial render, set the value for 'dayWorkSheetNo' from formData
    useEffect(() => {
        if (!formData.dayWorkSheetNo) {
            const storedNo = localStorage.getItem('dayWorkSheetNo');
            if (storedNo) {
                handleChange({ target: { name: 'dayWorkSheetNo', value: storedNo } });
            } else {
                const defaultNo = '4000';
                localStorage.setItem('dayWorkSheetNo', defaultNo);
                handleChange({ target: { name: 'dayWorkSheetNo', value: defaultNo } });
            }
        }
    }, [formData, handleChange]); // Run when formData changes

    // Handle dayWorkSheetNo input change
    const handleDayWorkSheetNoChange = (e) => {
        const newValue = e.target.value;
        localStorage.setItem('dayWorkSheetNo', newValue);
        handleChange(e); // Propagate change to parent form
    };

    return (
        <div>
            <div className="space-y-4">
                <TextInput
                    label="Day Work Sheet No"
                    name="dayWorkSheetNo"
                    value={formData.dayWorkSheetNo}
                    onChange={handleDayWorkSheetNoChange}
                />
                <TextInput
                    label="Job No"
                    name="jobNo"
                    value={formData.jobNo}
                    onChange={handleChange}
                />
                <TextInput
                    label="Customer"
                    name="customer"
                    value={formData.customer}
                    onChange={handleChange}
                />
                <TextareaInput
                    label="Site Address"
                    name="siteAddress"
                    value={formData.siteAddress}
                    onChange={handleChange}
                    placeholder="Site Address"
                />
                <TextareaInput
                    label="Area on Site of Works"
                    name="areaOfWorks"
                    value={formData.areaOfWorks}
                    onChange={handleChange}
                    placeholder="Area on Site of Works"
                />
                <TextareaInput
                    label="Works Completed"
                    name="worksCompleted"
                    value={formData.worksCompleted}
                    onChange={handleChange}
                    placeholder="Works Completed"
                />
            </div>
        </div>
    );
};

export default DetailsSection;
