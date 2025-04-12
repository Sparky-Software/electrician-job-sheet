import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoImage from '../assets/logo.bmp';

const getLogoBase64 = async (imagePath) => {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const generatePDF = async (formData, labour, materials) => {
    const doc = new jsPDF();

    // Use a font that supports special characters
    doc.setFont('helvetica'); // Helvetica supports the pound symbol

    // Define color constants
    const blue = [0, 51, 102]; // RGB for a professional blue

    console.log(formData);

    // Title
    doc.setFontSize(18);
    doc.setTextColor(...blue);
    doc.text('Job Sheet – Canning Electrical Ltd', 14, 20);

    const logoBase64 = await getLogoBase64(logoImage); // Convert image to Base64
    const logoWidth = 40; // Logo width
    const logoHeight = 15; // Logo height
    const topPadding = 10; // Negative value moves the logo higher (closer to top edge)
    const rightPadding = 15; // Padding from the right
    doc.addImage(logoBase64, 'BMP', doc.internal.pageSize.width - logoWidth - rightPadding, topPadding, logoWidth, logoHeight);

    // Prepare the table data for 4 columns
    const tableData = [
        ['Day Work Sheet No:', formData.dayWorkSheetNo, 'Job No:', formData.jobNo],
        ['Customer:', formData.customer, 'Address:', formData.siteAddress],
        ['Area of Works:', formData.areaOfWorks || '', 'Works Completed:', formData.worksCompleted || ''],
        ['Date:', formData.date, '', ''],
    ];

    // Add the table (4 columns)
    autoTable(doc, {
        startY: 30,
        head: [['Job Description', '', '', '']],
        body: tableData.map(row => [row[0], row[1], row[2], row[3]]),
        theme: 'grid',
        headStyles: {
            fillColor: blue,
            textColor: [255, 255, 255], // White text on blue background
            fontSize: 12,
            fontStyle: 'bold',
        },
        bodyStyles: {
            fillColor: [255, 255, 255], // White background
            textColor: [0, 0, 0], // Black text
            fontSize: 10,
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240], // Light gray for alternate rows
        },
        margin: { top: 10 },
        columnStyles: {
            0: { cellWidth: 'auto' }, // Adjust width of the first column (left-aligned)
            1: { cellWidth: 'auto' }, // Adjust width of the second column (right-aligned)
            2: { cellWidth: 'auto' }, // Adjust width of the third column (left-aligned)
            3: { cellWidth: 'auto' }, // Adjust width of the fourth column (right-aligned)
        }
    });

    // Labour Table
    if (labour.length > 0) {
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            head: [['Labour Description', 'Hours']],
            body: labour.map(item => [item.description, item.hours]),
            theme: 'grid',
            headStyles: {
                fillColor: blue,
                textColor: [255, 255, 255], // White text on blue background
                fontSize: 12,
                fontStyle: 'bold',
            },
            bodyStyles: {
                fillColor: [255, 255, 255], // White background
                textColor: [0, 0, 0], // Black text
                fontSize: 10,
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240], // Light gray for alternate rows
            },
            margin: { top: 10 },
        });
    } else {
        console.log('No labour data available.');
    }

    // Materials Table
    if (materials.length > 0) {
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            head: [['Materials Description', 'Qty', 'Cost']],
            body: materials.map(item => [item.description, item.qty, "£ "+item.cost]),
            theme: 'grid',
            headStyles: {
                fillColor: blue,
                textColor: [255, 255, 255],
                fontSize: 12,
                fontStyle: 'bold',
            },
            bodyStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontSize: 10,
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240],
            },
            margin: { top: 10 },
        });
    } else {
        console.log('No materials data available.');
    }

    // Default Y position in case no table is rendered
    let y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 70;  // Reduced gap after table

    // Bottom Section: Left and Right Columns
    const pageWidth = doc.internal.pageSize.width;
    const columnWidth = pageWidth / 2;  // Split the page into two columns (left and right)
    const signatureWidth = 60;
    const signatureHeight = 20;

    // Set color for labels (blue)
    // No blueC used, keeping the color blue defined above

    // Calculate X positions for left and right columns
    const leftColumnX = 14;  // Fixed X position for the left column
    const rightColumnX = columnWidth + 14;  // Fixed X position for the right column

    // Customer Signature in the Left Column
    if (formData.customerSignature) {
        let customerSignatureY = y + 10;  // Reduced space before the customer signature section

        // Set text size for labels (matching Materials and Labour headers)
        doc.setFontSize(12);
        doc.setTextColor(...blue); // Blue for labels
        doc.text('Customer Name:', leftColumnX, customerSignatureY);  // Label before the customer name

        customerSignatureY += 8; // Reduced gap between label and name

        // Set black for the customer name
        doc.setTextColor(0, 0, 0); // Black for the customer name
        doc.text(formData.customerName, leftColumnX, customerSignatureY);  // Customer name to the right of the label

        customerSignatureY += 8; // Reduced gap between name and signature

        // Signature goes to the right of the name
        doc.addImage(formData.customerSignature, 'PNG', leftColumnX, customerSignatureY, signatureWidth, signatureHeight);
    }

    // Electrician Signature in the Right Column
    if (formData.electricianSignature) {
        let electricianSignatureY = y + 10;  // Reduced space before the electrician signature section

        // Set text size for labels (matching Materials and Labour headers)
        doc.setFontSize(12);
        doc.setTextColor(...blue); // Blue for labels
        doc.text('Electrician Name:', rightColumnX, electricianSignatureY);  // Label before the electrician name

        electricianSignatureY += 8; // Reduced gap between label and name

        // Set black for the electrician name
        doc.setTextColor(0, 0, 0); // Black for the electrician name
        doc.text(formData.electricianName, rightColumnX, electricianSignatureY);  // Electrician name to the right of the label

        electricianSignatureY += 8; // Reduced gap between name and signature

        // Signature goes to the right of the name
        doc.addImage(formData.electricianSignature, 'PNG', rightColumnX, electricianSignatureY, signatureWidth, signatureHeight);
        electricianSignatureY += signatureHeight + 5; // Adjust Y for spacing after the signature
    }

    // Save the PDF
    doc.save('job_sheet.pdf');
};

export default generatePDF;
