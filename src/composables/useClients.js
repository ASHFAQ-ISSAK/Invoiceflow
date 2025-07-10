import { ref, watch } from 'vue';

const clients = ref(JSON.parse(localStorage.getItem('clients') || '[]'));

export function useClients() {
    watch(clients, (newClients) => {
        localStorage.setItem('clients', JSON.stringify(newClients));
    }, { deep: true });
    
    const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

    const addClient = (clientData) => {
        const newClient = { 
            id: generateId(), 
            createdAt: new Date().toISOString().split('T')[0],
            ...clientData 
        };
        clients.value.push(newClient);
        return newClient;
    };

    const updateClient = (clientData) => {
        const index = clients.value.findIndex(c => c.id === clientData.id);
        if (index !== -1) {
            clients.value[index] = clientData;
        }
        return clientData;
    };
    
    const deleteClient = (id) => {
        clients.value = clients.value.filter(c => c.id !== id);
    };
    
    const getClientById = (id) => {
        return clients.value.find(c => c.id === id);
    };

    return { clients, addClient, updateClient, deleteClient, getClientById };
}