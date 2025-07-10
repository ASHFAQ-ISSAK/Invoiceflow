<template>
    <div class="modal" @click.self="close">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">{{ isEditing ? 'Edit Invoice' : 'Create New Invoice' }}</h2>
                <button class="close-btn" @click="close">&times;</button>
            </div>
            
            <form @submit.prevent="submitForm">
                <div class="grid-2">
                    <div class="form-group">
                        <label>Client</label>
                        <select class="form-input" v-model="form.clientId" required>
                            <option value="" disabled>Select Client</option>
                            <option v-for="client in clients" :key="client.id" :value="client.id">
                                {{ client.name }}
                            </option>
                        </select>
                    </div>
                   
                    <div class="form-group">
                        <label>Due Date</label>
                        <input type="date" class="form-input" v-model="form.dueDate" required>
                    </div>
                </div>

                <div class="invoice-items">
                    <h4>Invoice Items</h4>
                    <div v-for="(item, index) in form.items" :key="index" class="invoice-item">
                        <input type="text" placeholder="Description" v-model="item.description" class="form-input" required>
                        <input type="number" placeholder="Quantity" v-model.number="item.quantity" class="form-input" min="0.01" step="0.01" required>
                        <input type="number" placeholder="Rate" v-model.number="item.rate" class="form-input" min="0.01" step="0.01" required>
                        <span class="currency-symbol">{{ formatCurrency(item.quantity * item.rate) }}</span>
                        <button type="button" class="btn btn-danger" @click="removeItem(index)">Remove</button>
                    </div>
                    <button type="button" class="btn btn-secondary" @click="addItem">Add Item</button>
                </div>

                <div class="grid-3">
                    <div class="form-group">
                        <label>Discount Type</label>
                        <select class="form-input" v-model="form.discountType">
                            <option value="none">No Discount</option>
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                        </select>
                    </div>
                    <div class="form-group" v-if="form.discountType !== 'none'">
                        <label>Discount Value</label>
                        <input type="number" class="form-input" v-model.number="form.discountValue" min="0" step="0.01">
                    </div>
                    <div class="form-group">
                        <label>Tax Rate (%)</label>
                        <input type="number" class="form-input" v-model.number="form.taxRate" min="0" max="100" step="0.01">
                    </div>
                </div>

                <div class="form-group">
                    <label>Notes</label>
                    <textarea class="form-input" v-model="form.notes" rows="3"></textarea>
                </div>

                <div class="invoice-summary">
                    <div class="summary-row">
                        <span>Subtotal:</span>
                        <span>{{ formatCurrency(summary.subtotal) }}</span>
                    </div>
                    <div class="summary-row" v-if="form.discountType !== 'none'">
                        <span>Discount:</span>
                        <span>-{{ formatCurrency(summary.discount) }}</span>
                    </div>
                    <div class="summary-row">
                        <span>Tax:</span>
                        <span>{{ formatCurrency(summary.tax) }}</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total:</span>
                        <span>{{ formatCurrency(summary.total) }}</span>
                    </div>
                </div>

                <div class="action-buttons mt-20">
                    <button type="submit" class="btn">
                        {{ isEditing ? 'Update Invoice' : 'Create Invoice' }}
                    </button>
                    <button type="button" class="btn btn-secondary" @click="close">Cancel</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useClients } from '../composables/useClients';
import { useAlerts } from '../composables/useAlerts';

const props = defineProps({
    invoiceToEdit: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['close', 'save']);
const { clients } = useClients();
const { showAlert } = useAlerts();

const isEditing = computed(() => !!props.invoiceToEdit);

const form = ref(
    props.invoiceToEdit
        ? JSON.parse(JSON.stringify(props.invoiceToEdit))
        : {
            clientId: '',
            dueDate: '',
            items: [{ description: '', quantity: 1, rate: 0 }],
            discountType: 'none',
            discountValue: 0,
            taxRate: 16,
            notes: '',
        }
);

const summary = computed(() => {
    const subtotal = form.value.items.reduce((sum, item) => sum + (item.quantity * item.rate || 0), 0);
    
    let discount = 0;
    if (form.value.discountType === 'percentage') {
        discount = subtotal * (form.value.discountValue / 100 || 0);
    } else if (form.value.discountType === 'fixed') {
        discount = form.value.discountValue || 0;
    }
    
    const tax = (subtotal - discount) * (form.value.taxRate / 100 || 0);
    const total = subtotal - discount + tax;
    
    return { subtotal, discount, tax, total };
});

const formatCurrency = (amount) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount || 0);

const addItem = () => {
    form.value.items.push({ description: '', quantity: 1, rate: 0 });
};

const removeItem = (index) => {
    if (form.value.items.length > 1) {
        form.value.items.splice(index, 1);
    } else {
        showAlert('error', 'An invoice must have at least one item.');
    }
};

const submitForm = () => {
    if (!form.value.clientId || !form.value.dueDate || form.value.items.some(i => !i.description || !i.quantity || !i.rate)) {
        showAlert('error', 'Please fill all required fields.');
        return;
    }
    
    const finalData = {
        ...form.value,
        subtotal: summary.value.subtotal,
        discountAmount: summary.value.discount,
        taxAmount: summary.value.tax,
        totalAmount: summary.value.total
    };
    emit('save', finalData);
};

const close = () => emit('close');
</script>