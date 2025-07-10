// src/services/pdfGenerator.js

import { jsPDF } from "jspdf";
import 'jspdf-autotable';

const formatCurrency = (amount) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount || 0);
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export function generateInvoicePDF(invoice, client, senderDetails) {
    const doc = new jsPDF();
    
    // --- FIX: Added fallbacks to prevent 'undefined' errors ---
    const safeSender = senderDetails || {};
    const safeClient = client || {};

    // Header
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229);
    doc.text(safeSender.name || 'Your Company', 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(safeSender.address || '', 20, 28);
    doc.text(`${safeSender.city || ''}, ${safeSender.country || ''}`, 20, 33);
    doc.text(`Email: ${safeSender.email || ''}`, 20, 38);
    doc.text(`Phone: ${safeSender.phone || ''}`, 20, 43);

    // Invoice Info
    doc.setFontSize(16);
    doc.setTextColor(50);
    doc.text(`Invoice #${invoice.invoiceNumber || ''}`, 200, 20, { align: 'right' });

    doc.setFontSize(10);
    doc.text(`Issue Date: ${formatDate(invoice.issueDate)}`, 200, 28, { align: 'right' });
    doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, 200, 33, { align: 'right' });

    // Bill To
    doc.setFontSize(12);
    doc.setTextColor(150);
    doc.text('Bill To:', 20, 60);
    doc.setTextColor(50);
    doc.text(safeClient.name || 'Unknown Client', 20, 68);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(safeClient.address || '', 20, 74);
    doc.text(safeClient.city || '' ? `${safeClient.city}, ${safeClient.country || ''}` : '', 20, 79);
    doc.text(`Email: ${safeClient.email || ''}`, 20, 84);

    // Table
    const tableColumn = ["Description", "Quantity", "Rate", "Amount"];
    const tableRows = [];
    invoice.items.forEach(item => {
        const itemData = [
            item.description,
            item.quantity,
            formatCurrency(item.rate),
            formatCurrency(item.quantity * item.rate)
        ];
        tableRows.push(itemData);
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 95,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] }
    });

    // Totals
    const finalY = doc.lastAutoTable.finalY;
    doc.setFontSize(10);
    let yPos = finalY + 10;
    
    doc.text(`Subtotal:`, 150, yPos);
    doc.text(formatCurrency(invoice.subtotal), 200, yPos, { align: 'right' });
    yPos += 7;

    if (invoice.discountType !== 'none' && invoice.discountAmount > 0) {
        doc.text(`Discount:`, 150, yPos);
        doc.text(`-${formatCurrency(invoice.discountAmount)}`, 200, yPos, { align: 'right' });
        yPos += 7;
    }
    
    doc.text(`Tax (${invoice.taxRate || 0}%):`, 150, yPos);
    doc.text(formatCurrency(invoice.taxAmount), 200, yPos, { align: 'right' });
    yPos += 7;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Total:`, 150, yPos);
    doc.text(formatCurrency(invoice.totalAmount), 200, yPos, { align: 'right' });

    // Notes
    if (invoice.notes) {
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('Notes:', 20, finalY + 15);
        doc.setTextColor(100);
        doc.text(invoice.notes, 20, finalY + 20, { maxWidth: 120 });
    }
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Thank you for your business!', 105, 285, { align: 'center' });

    doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);
}