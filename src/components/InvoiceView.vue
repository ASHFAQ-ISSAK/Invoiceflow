<template>
    <div class="modal" @click.self="close">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Invoice {{ invoice.invoiceNumber }}</h2>
                <div class="action-buttons">
                    <button class="btn btn-success" @click="downloadPDF">Generate PDF</button>
                    <button class="close-btn" @click="close">&times;</button>
                </div>
            </div>
           
            <div class="grid-2 mb-20">
                <div>
                    <h4>From:</h4>
                    <p><strong>{{ sender.name }}</strong></p>
                    <p v-if="sender.address">{{ sender.address }}</p>
                    <p v-if="sender.city || sender.country">
                        {{ sender.city }}{{ sender.city && sender.country ? ', ' : '' }}{{ sender.country }}
                    </p>
                    <p v-if="sender.email">Email: {{ sender.email }}</p>
                    <p v-if="sender.phone">Phone: {{ sender.phone }}</p>
                </div>
                <div v-if="client">
                    <h4>To:</h4>
                    <p><strong>{{ client.name }}</strong></p>
                    <p v-if="client.address">{{ client.address }}</p>
                    <p v-if="client.city || client.country">
                        {{ client.city }}{{ client.city && client.country ? ', ' : '' }}{{ client.country }}
                    </p>
                    <p v-if="client.email">Email: {{ client.email }}</p>
                </div>
            </div>

            <div class="grid-3 mb-20">
                <div><strong>Issue Date:</strong><br>{{ formatDate(invoice.issueDate) }}</div>
                <div><strong>Due Date:</strong><br>{{ formatDate(invoice.dueDate) }}</div>
                <div>
                    <strong>Status:</strong><br>
                    <span :class="`status-badge status-${invoice.status}`">{{ invoice.status }}</span>
                </div>
            </div>

            <table class="table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Rate</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in invoice.items" :key="index">
                        <td>{{ item.description }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>{{ formatCurrency(item.rate) }}</td>
                        <td>{{ formatCurrency(item.quantity * item.rate) }}</td>
                    </tr>
                </tbody>
            </table>

            <div class="invoice-summary">
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>{{ formatCurrency(invoice.subtotal) }}</span>
                </div>
                <div class="summary-row" v-if="invoice.discountType !== 'none'">
                    <span>Discount ({{ invoice.discountType === 'percentage' ? invoice.discountValue + '%' : 'Fixed' }}):</span>
                    <span>-{{ formatCurrency(invoice.discountAmount) }}</span>
                </div>
                <div class="summary-row">
                    <span>Tax ({{ invoice.taxRate }}%):</span>
                    <span>{{ formatCurrency(invoice.taxAmount) }}</span>
                </div>
                <div class="summary-row total">
                    <span>Total:</span>
                    <span>{{ formatCurrency(invoice.totalAmount) }}</span>
                </div>
            </div>
            
            <div class="form-group mt-20" v-if="invoice.notes">
                <label>Notes:</label>
                <p>{{ invoice.notes }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useClients } from '../composables/useClients';
import { generateInvoicePDF } from '../services/pdfGenerator.js';

const props = defineProps({
    invoice: { type: Object, required: true },
    sender: { type: Object, required: true }
});

const emit = defineEmits(['close']);
const { getClientById } = useClients();

const client = computed(() => getClientById(props.invoice.clientId));

const formatCurrency = (amount) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount || 0);
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const downloadPDF = () => {
    generateInvoicePDF(props.invoice, client.value, props.sender);
};

const close = () => emit('close');
</script>