<template>
    <div class="card">
        <div class="modal-header">
            <h2 class="modal-title">Invoice Management</h2>
            <button class="btn" @click="createNewInvoice">+ Create New Invoice</button>
        </div>
       
        <table class="table">
            <thead>
                <tr>
                    <th>Invoice #</th><th>Client</th><th>Amount</th><th>Status</th>
                    <th>Issue Date</th><th>Due Date</th><th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="invoice in invoices" :key="invoice.id">
                    <td>{{ invoice.invoiceNumber }}</td>
                    <td>{{ getClientName(invoice.clientId) }}</td>
                    <td>{{ formatCurrency(invoice.totalAmount) }}</td>
                    <td><span :class="`status-badge status-${invoice.status}`">{{ invoice.status }}</span></td>
                    <td>{{ formatDate(invoice.issueDate) }}</td>
                    <td>{{ formatDate(invoice.dueDate) }}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-secondary" @click="viewingInvoice = invoice">View</button>
                            <button class="btn" @click="editInvoice(invoice)">Edit</button>
                            <button class="btn btn-success" @click="downloadPDF(invoice)">PDF</button>
                            <button v-if="invoice.status === 'draft'" class="btn" @click="send(invoice.id)">Send</button>
                            <button v-if="invoice.status !== 'paid'" class="btn btn-success" @click="markAsPaid(invoice.id)">Mark as Paid</button>
                            <button class="btn btn-danger" @click="confirmDelete(invoice.id)">Delete</button>
                        </div>
                    </td>
                </tr>
                <tr v-if="!invoices.length">
                    <td colspan="7" style="text-align: center;">No invoices found. Create one to get started!</td>
                </tr>
            </tbody>
        </table>
    </div>

    <InvoiceForm 
    v-if="showInvoiceModal" 
    :invoice-to-edit="editingInvoice"
    :key="editingInvoice ? editingInvoice.id : 'new'"
    @close="closeModal" 
    @save="handleSave" 
/>
    <InvoiceView
        v-if="viewingInvoice"
        :invoice="viewingInvoice"
        :sender="senderDetails"
        @close="viewingInvoice = null"
    />
</template>

<script setup>
import { ref } from 'vue';
import InvoiceForm from '../components/InvoiceForm.vue';
import InvoiceView from '../components/InvoiceView.vue';
import { useInvoices } from '../composables/useInvoices';
import { useClients } from '../composables/useClients';
import { useAlerts } from '../composables/useAlerts';
import { generateInvoicePDF } from '../services/pdfGenerator';

const { invoices, addInvoice, updateInvoice, deleteInvoice, setInvoiceStatus } = useInvoices();
const { getClientById } = useClients();
const { showAlert } = useAlerts();

const showInvoiceModal = ref(false);
const editingInvoice = ref(null);
const viewingInvoice = ref(null);
const senderDetails = ref(JSON.parse(localStorage.getItem('senderDetails') || '{}'));


const getClientName = (id) => getClientById(id)?.name || 'N/A';
const formatCurrency = (amount) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount || 0);
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const createNewInvoice = () => {
    editingInvoice.value = null;
    showInvoiceModal.value = true;
};

const editInvoice = (invoice) => {
    editingInvoice.value = invoice;
    showInvoiceModal.value = true;
};

const closeModal = () => {
    showInvoiceModal.value = false;
    editingInvoice.value = null;
};

const handleSave = (invoiceData) => {
    if(invoiceData.id) {
        updateInvoice(invoiceData);
        showAlert('success', 'Invoice updated successfully!');
    } else {
        addInvoice(invoiceData);
        showAlert('success', 'Invoice created successfully!');
    }
    closeModal();
};

const confirmDelete = (id) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
        deleteInvoice(id);
        showAlert('success', 'Invoice deleted.');
    }
};

const send = (id) => {
    setInvoiceStatus(id, 'sent');
    showAlert('success', 'Invoice marked as sent.');
};

const markAsPaid = (id) => {
    setInvoiceStatus(id, 'paid');
    showAlert('success', 'Invoice marked as paid.');
};

const downloadPDF = (invoice) => {
    const client = getClientById(invoice.clientId);
    generateInvoicePDF(invoice, client, senderDetails.value);
}
</script>