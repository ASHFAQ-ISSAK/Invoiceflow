<template>
    <div>
        <div class="dashboard-grid">
            <div class="card">
                <h3>Revenue Summary</h3>
                <div class="summary-row mt-20"><span>Paid Amount:</span><span>{{ formatCurrency(paidAmount) }}</span></div>
                <div class="summary-row"><span>Pending Amount:</span><span>{{ formatCurrency(pendingAmount) }}</span></div>
                <div class="summary-row"><span>Overdue Amount:</span><span>{{ formatCurrency(overdueAmount) }}</span></div>
            </div>

            <div class="card">
                <h3>Invoice Statistics</h3>
                <div class="summary-row mt-20"><span>Total Invoices:</span><span>{{ invoices.length }}</span></div>
                <div class="summary-row"><span>Paid Invoices:</span><span>{{ invoices.filter(i => i.status === 'paid').length }}</span></div>
                <div class="summary-row"><span>Pending Invoices:</span><span>{{ pendingInvoices.length }}</span></div>
                <div class="summary-row"><span>Overdue Invoices:</span><span>{{ overdueInvoices.length }}</span></div>
            </div>
        </div>

        <div class="dashboard-grid mt-20">
            <div class="card">
                <h3>Monthly Revenue (Last 6 Months)</h3>
                <RevenueChart :invoices="invoices" />
            </div>
            <div class="card">
                <h3>Invoice Status Distribution</h3>
                <StatusChart :invoices="invoices" />
            </div>
        </div>
    </div>
</template>

<script setup>
import RevenueChart from '../components/RevenueChart.vue';
import StatusChart from '../components/StatusChart.vue';
import { useInvoices } from '../composables/useInvoices';

const { invoices, paidAmount, pendingAmount, overdueAmount, pendingInvoices, overdueInvoices } = useInvoices();
const formatCurrency = (amount) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount || 0);
</script>