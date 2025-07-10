<template>
    <div class="modal" @click.self="close">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">{{ isEditing ? 'Edit Client' : 'Add New Client' }}</h2>
                <button class="close-btn" @click="close">&times;</button>
            </div>
           
            <form @submit.prevent="submitForm">
                <div class="grid-2">
                    <div class="form-group">
                        <label>Name *</label>
                        <input type="text" class="form-input" v-model="form.name" required>
                    </div>
                   
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" class="form-input" v-model="form.email" required>
                    </div>
                   
                    <div class="form-group">
                        <label>Company</label>
                        <input type="text" class="form-input" v-model="form.company">
                    </div>
                   
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="text" class="form-input" v-model="form.phone">
                    </div>
                </div>

                <div class="form-group">
                    <label>Address</label>
                    <textarea class="form-input" v-model="form.address" rows="3"></textarea>
                </div>

                <div class="grid-3">
                    <div class="form-group">
                        <label>City</label>
                        <input type="text" class="form-input" v-model="form.city">
                    </div>
                   
                    <div class="form-group">
                        <label>Country</label>
                        <input type="text" class="form-input" v-model="form.country">
                    </div>
                   
                    <div class="form-group">
                        <label>Payment Terms (Days)</label>
                        <input type="number" class="form-input" v-model.number="form.paymentTerms" min="1">
                    </div>
                </div>

                <div class="action-buttons mt-20">
                    <button type="submit" class="btn">
                        {{ isEditing ? 'Update Client' : 'Add Client' }}
                    </button>
                    <button type="button" class="btn btn-secondary" @click="close">Cancel</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
    clientToEdit: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['close', 'save']);

const isEditing = computed(() => !!props.clientToEdit);

const form = ref({});

onMounted(() => {
    form.value = props.clientToEdit 
        ? { ...props.clientToEdit }
        : {
            name: '',
            email: '',
            company: '',
            phone: '',
            address: '',
            city: '',
            country: '',
            paymentTerms: 30
        };
});

const submitForm = () => {
    if (!form.value.name || !form.value.email) {
        alert('Client Name and Email are required.'); // Replace with a better alert system if needed
        return;
    }
    emit('save', form.value);
};

const close = () => {
    emit('close');
};
</script>