import { ref } from 'vue';
import { supabase } from '../supabase';

const clients = ref([]);

// --- HELPER FUNCTIONS ---
function snakeToCamelCase(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    const newObj = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            newObj[camelKey] = obj[key];
        }
    }
    return newObj;
}
function camelToSnakeCase(obj) {
    const newObj = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            newObj[snakeKey] = obj[key];
        }
    }
    return newObj;
}

// --- DATA FETCHING ---
async function fetchClients() {
    const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error('Error fetching clients:', error);
    } else {
        // FIX: Convert fetched data to camelCase
        clients.value = data.map(snakeToCamelCase);
    }
}

export function useClients() {
    // --- CRUD FUNCTIONS ---
    const addClient = async (clientData) => {
        const { data, error } = await supabase.from('clients').insert(camelToSnakeCase(clientData)).select();
        if (error) console.error('Error adding client:', error);
        // FIX: Convert the single returned record to camelCase
        else if (data) clients.value.unshift(snakeToCamelCase(data[0]));
    };

    const updateClient = async (clientData) => {
        const { data, error } = await supabase.from('clients').update(camelToSnakeCase(clientData)).eq('id', clientData.id).select();
        if (error) console.error('Error updating client:', error);
        // FIX: Convert the single returned record to camelCase
        else if (data) {
             const index = clients.value.findIndex(c => c.id === data[0].id);
             if (index !== -1) clients.value[index] = snakeToCamelCase(data[0]);
        }
    };
    
    const deleteClient = async (id) => {
        const { error } = await supabase.from('clients').delete().eq('id', id);
        if (error) console.error('Error deleting client:', error);
        else clients.value = clients.value.filter(c => c.id !== id);
    };
    
    const getClientById = (id) => clients.value.find(c => c.id === id);

    return { clients, fetchClients, addClient, updateClient, deleteClient, getClientById };
}