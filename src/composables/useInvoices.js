import { ref, computed } from 'vue';
import { supabase } from '../supabase';

const invoices = ref([]);

// --- HELPER FUNCTIONS ---
function snakeToCamelCase(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(snakeToCamelCase); // Handle arrays
    
    const newObj = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            newObj[camelKey] = snakeToCamelCase(obj[key]); // Recursively convert nested objects
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
async function fetchInvoices() {
    const { data, error } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching invoices:', error);
    // FIX: Convert fetched data to camelCase
    else invoices.value = data.map(snakeToCamelCase);
}

export function useInvoices() {
    // FIX: Computed properties now use camelCase again
    const paidAmount = computed(() => invoices.value.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.totalAmount, 0));
    const pendingInvoices = computed(() => invoices.value.filter(inv => inv.status === 'sent'));
    const overdueInvoices = computed(() => invoices.value.filter(inv => inv.status === 'overdue'));
    const pendingAmount = computed(() => pendingInvoices.value.reduce((sum, inv) => sum + inv.totalAmount, 0));
    const overdueAmount = computed(() => overdueInvoices.value.reduce((sum, inv) => sum + inv.totalAmount, 0));
    const recentInvoices = computed(() => invoices.value.slice(0, 5));

    // --- CRUD FUNCTIONS ---
    const addInvoice = async (invoiceData) => {
        const newInvoiceData = {
            invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
            issueDate: new Date().toISOString().split('T')[0],
            status: 'draft',
            ...invoiceData
        };
        const { data, error } = await supabase.from('invoices').insert(camelToSnakeCase(newInvoiceData)).select();
        if (error) console.error('Error adding invoice:', error);
        // FIX: Convert the single returned record to camelCase
        else if (data) invoices.value.unshift(snakeToCamelCase(data[0]));
    };

    const updateInvoice = async (invoiceData) => {
        const { data, error } = await supabase.from('invoices').update(camelToSnakeCase(invoiceData)).eq('id', invoiceData.id).select();
        if (error) console.error('Error updating invoice:', error);
        // FIX: Convert the single returned record to camelCase
        else if (data) {
             const index = invoices.value.findIndex(i => i.id === data[0].id);
             if (index !== -1) invoices.value[index] = snakeToCamelCase(data[0]);
        }
    };

    const deleteInvoice = async (id) => {
        const { error } = await supabase.from('invoices').delete().eq('id', id);
        if (error) console.error('Error deleting invoice:', error);
        else invoices.value = invoices.value.filter(i => i.id !== id);
    };
    
    const setInvoiceStatus = async (invoiceId, status) => {
        const { data, error } = await supabase.from('invoices').update({ status }).eq('id', invoiceId).select();
         if (error) console.error('Error setting status:', error);
         // FIX: Convert the single returned record to camelCase
         else if (data) {
             const index = invoices.value.findIndex(i => i.id === data[0].id);
             if (index !== -1) invoices.value[index] = snakeToCamelCase(data[0]);
         }
    };
    
    return { 
        invoices, fetchInvoices,
        paidAmount, pendingInvoices, overdueInvoices, pendingAmount, overdueAmount, recentInvoices,
        addInvoice, updateInvoice, deleteInvoice, setInvoiceStatus
    };
}