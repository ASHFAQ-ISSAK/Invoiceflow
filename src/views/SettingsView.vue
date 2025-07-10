<template>
    <div class="card">
        <h2 class="modal-title mb-20">Your Business Details</h2>
        <p class="mb-20">This information will appear as the sender on your invoices.</p>
       
        <form @submit.prevent="saveDetails">
            <div class="grid-2">
                <div class="form-group">
                    <label>Business Name *</label>
                    <input type="text" class="form-input" v-model="details.name" required>
                </div>
                <div class="form-group">
                    <label>Email *</label>
                    <input type="email" class="form-input" v-model="details.email" required>
                </div>
            </div>

            <div class="form-group">
                <label>Address</label>
                <input type="text" class="form-input" v-model="details.address">
            </div>

            <div class="grid-3">
                <div class="form-group">
                    <label>City</label>
                    <input type="text" class="form-input" v-model="details.city">
                </div>
                <div class="form-group">
                    <label>Country</label>
                    <input type="text" class="form-input" v-model="details.country">
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="text" class="form-input" v-model="details.phone">
                </div>
            </div>

            <div class="action-buttons mt-20">
                <button class="btn btn-success" type="submit">Save Details</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useAlerts } from '../composables/useAlerts';

const { showAlert } = useAlerts();

const defaultDetails = {
    name: 'InvoiceFlow Inc',
    address: '123 Banda street',
    city: 'Nairobi',
    country: 'Kenya',
    email: 'info@invoiceflow.com',
    phone: '+254 7XX XXX XXX'
};

const details = ref(JSON.parse(localStorage.getItem('senderDetails')) || defaultDetails);

const saveDetails = () => {
    if (!details.value.name || !details.value.email) {
        showAlert('error', 'Business Name and Email are required.');
        return;
    }
    localStorage.setItem('senderDetails', JSON.stringify(details.value));
    showAlert('success', 'Your business details have been saved!');
};
</script>