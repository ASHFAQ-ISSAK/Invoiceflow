import { ref, computed, watch } from 'vue';

const invoices = ref(JSON.parse(localStorage.getItem('invoices') || '[]'));

function updateInvoiceStatuses() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    invoices.value.forEach(invoice => {
        const dueDate = new Date(invoice.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        if (invoice.status === 'sent' && dueDate < today) {
            invoice.status = 'overdue';
        }
    });
}

// Run on initial load
updateInvoiceStatuses();

export function useInvoices() {
    watch(invoices, (newInvoices) => {
        localStorage.setItem('invoices', JSON.stringify(newInvoices));
    }, { deep: true });

    // Computed Properties
    const paidAmount = computed(() => invoices.value.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.totalAmount, 0));
    const pendingInvoices = computed(() => invoices.value.filter(inv => inv.status === 'sent'));
    const overdueInvoices = computed(() => invoices.value.filter(inv => inv.status === 'overdue'));
    
    const pendingAmount = computed(() => pendingInvoices.value.reduce((sum, inv) => sum + inv.totalAmount, 0));
    const overdueAmount = computed(() => overdueInvoices.value.reduce((sum, inv) => sum + inv.totalAmount, 0));
    
    const recentInvoices = computed(() => [...invoices.value].sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()).slice(0, 5));

    // Methods
    const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

    const addInvoice = (invoiceData) => {
        const newInvoice = {
            id: generateId(),
            invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
            issueDate: new Date().toISOString().split('T')[0],
            status: 'draft',
            ...invoiceData
        };
        invoices.value.push(newInvoice);
        return newInvoice;
    };

    const updateInvoice = (invoiceData) => {
        const index = invoices.value.findIndex(inv => inv.id === invoiceData.id);
        if (index !== -1) {
            invoices.value[index] = { ...invoices.value[index], ...invoiceData };
        }
        return invoiceData;
    };

    const deleteInvoice = (id) => {
        invoices.value = invoices.value.filter(inv => inv.id !== id);
    };

    const setInvoiceStatus = (invoiceId, status) => {
         const index = invoices.value.findIndex(inv => inv.id === invoiceId);
         if (index !== -1) {
            invoices.value[index].status = status;
            updateInvoiceStatuses(); // Re-check statuses after a change
         }
    };
    
    return { 
        invoices,
        paidAmount,
        pendingInvoices,
        overdueInvoices,
        pendingAmount,
        overdueAmount,
        recentInvoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        setInvoiceStatus,
        updateInvoiceStatuses
    };
}