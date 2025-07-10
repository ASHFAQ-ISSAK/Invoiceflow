<template>
    <div>
        <div class="dashboard-grid">
            <KpiCard 
                icon-name="payments"
                icon-class="kpi-icon-revenue"
                :value="formatCurrency(paidAmount)"
                label="Total Revenue"
            />
            <KpiCard 
                icon-name="pending_actions"
                icon-class="kpi-icon-pending"
                :value="formatCurrency(pendingAmount)"
                :label="`Pending (${pendingInvoices.length} invoices)`"
            />
             <KpiCard 
                icon-name="error"
                icon-class="kpi-icon-overdue"
                :value="formatCurrency(overdueAmount)"
                :label="`Overdue (${overdueInvoices.length} invoices)`"
            />
        </div>

        <div class="card mb-20">
            <h3>Quick Actions</h3>
            <div class="action-buttons mt-20">
                <button class="btn" @click="createNewInvoice">+ Create New Invoice</button>
                <button class="btn btn-secondary" @click="showClientModal = true">+ Add Client</button>
            </div>
        </div>

        <div class="card">
            <h3>Recent Invoices</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>Invoice #</th>
                        <th>Client</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="invoice in recentInvoices" :key="invoice.id">
                        <td>{{ invoice.invoiceNumber }}</td>
                        <td>{{ getClientName(invoice.clientId) }}</td>
                        <td>{{ formatCurrency(invoice.totalAmount) }}</td>
                        <td>
                            <span :class="`status-badge status-${invoice.status}`">{{ invoice.status }}</span>
                        </td>
                        <td>{{ formatDate(invoice.issueDate) }}</td>
                        <td>
                            <button class="btn btn-secondary" @click="viewInvoice(invoice)">View</button>
                        </td>
                    </tr>
                     <tr v-if="!recentInvoices.length">
                        <td colspan="6" style="text-align: center;">No recent invoices found.</td>
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
        <ClientForm 
            v-if="showClientModal"
            @close="showClientModal = false"
            @save="handleClientSave"
        />
        <InvoiceView
            v-if="viewingInvoice"
            :invoice="viewingInvoice"
            :sender="senderDetails"
            @close="viewingInvoice = null"
        />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import KpiCard from '../components/KpiCard.vue';
import InvoiceForm from '../components/InvoiceForm.vue';
import ClientForm from '../components/ClientForm.vue';
import InvoiceView from '../components/InvoiceView.vue';
import { useInvoices } from '../composables/useInvoices';
import { useClients } from '../composables/useClients';
import { useAlerts } from '../composables/useAlerts';

// FIX: Added updateInvoice to the destructuring
const { paidAmount, pendingAmount, pendingInvoices, overdueAmount, overdueInvoices, recentInvoices, addInvoice, updateInvoice } = useInvoices();
const { getClientById, addClient } = useClients();
const { showAlert } = useAlerts();

const senderDetails = ref(JSON.parse(localStorage.getItem('senderDetails') || '{}'));

const showInvoiceModal = ref(false);
const showClientModal = ref(false);
const viewingInvoice = ref(null);
// FIX: Added editingInvoice ref to track state
const editingInvoice = ref(null);

const getClientName = (id) => getClientById(id)?.name || 'N/A';
const formatCurrency = (amount) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount || 0);
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

// FIX: Added explicit create method
const createNewInvoice = () => {
    editingInvoice.value = null; // Ensure we are in "create" mode
    showInvoiceModal.value = true;
};

// FIX: Renamed and implemented robust save logic
const handleSave = (invoiceData) => {
    if (invoiceData.id) {
        updateInvoice(invoiceData);
        showAlert('success', 'Invoice updated!');
    } else {
        addInvoice(invoiceData);
        showAlert('success', 'Invoice created!');
    }
    closeModal();
};

const handleClientSave = (clientData) => {
    addClient(clientData);
    showAlert('success', 'New client added!');
    showClientModal.value = false;
};

const viewInvoice = (invoice) => {
    viewingInvoice.value = invoice;
};

// FIX: Added a generic close method
const closeModal = () => {
    showInvoiceModal.value = false;
    editingInvoice.value = null;
};
</script>