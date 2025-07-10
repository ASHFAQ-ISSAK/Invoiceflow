<template>
    <div class="card">
        <div class="modal-header">
            <h2 class="modal-title">Client Management</h2>
            <button class="btn" @click="createNewClient">+ Add New Client</button>
        </div>
       
        <table class="table">
            <thead>
                <tr>
                    <th>Name</th><th>Email</th><th>Company</th>
                    <th>Phone</th><th>Created</th><th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="client in clients" :key="client.id">
                    <td>{{ client.name }}</td>
                    <td>{{ client.email }}</td>
                    <td>{{ client.company || 'N/A' }}</td>
                    <td>{{ client.phone || 'N/A' }}</td>
                    <td>{{ formatDate(client.createdAt) }}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn" @click="editClient(client)">Edit</button>
                            <button class="btn btn-danger" @click="confirmDelete(client.id)">Delete</button>
                        </div>
                    </td>
                </tr>
                 <tr v-if="!clients.length">
                    <td colspan="6" style="text-align: center;">No clients found. Add one to get started.</td>
                </tr>
            </tbody>
        </table>
    </div>

    <ClientForm 
        v-if="showClientModal"
        :client-to-edit="editingClient"
        @close="closeModal"
        @save="handleSave"
    />
</template>

<script setup>
import { ref } from 'vue';
import ClientForm from '../components/ClientForm.vue';
import { useClients } from '../composables/useClients';
import { useAlerts } from '../composables/useAlerts';

const { clients, addClient, updateClient, deleteClient } = useClients();
const { showAlert } = useAlerts();

const showClientModal = ref(false);
const editingClient = ref(null);

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const createNewClient = () => {
    editingClient.value = null;
    showClientModal.value = true;
};

const editClient = (client) => {
    editingClient.value = client;
    showClientModal.value = true;
};

const closeModal = () => {
    showClientModal.value = false;
    editingClient.value = null;
};

const handleSave = (clientData) => {
    if(clientData.id) {
        updateClient(clientData);
        showAlert('success', 'Client updated successfully!');
    } else {
        addClient(clientData);
        showAlert('success', 'Client added successfully!');
    }
    closeModal();
};

const confirmDelete = (id) => {
    if (confirm('Are you sure you want to delete this client?')) {
        deleteClient(id);
        showAlert('success', 'Client deleted.');
    }
};
</script>