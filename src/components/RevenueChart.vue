<template>
    <div class="chart-container">
        <canvas ref="chartCanvas"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
    invoices: {
        type: Array,
        required: true
    }
});

const chartCanvas = ref(null);
let chartInstance = null;

const renderChart = () => {
    if (chartInstance) {
        chartInstance.destroy();
    }
    if (!chartCanvas.value) return;

    const monthlyRevenue = {};
    const lastSixMonths = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = date.toLocaleString('default', { month: 'short', year: '2-digit' });
        lastSixMonths.push(monthName);
        monthlyRevenue[monthName] = 0;
    }

    props.invoices.filter(inv => inv.status === 'paid').forEach(inv => {
        const date = new Date(inv.issueDate);
        const monthName = date.toLocaleString('default', { month: 'short', year: '2-digit' });
        if (monthlyRevenue.hasOwnProperty(monthName)) {
            monthlyRevenue[monthName] += inv.totalAmount;
        }
    });

    chartInstance = new Chart(chartCanvas.value, {
        type: 'bar',
        data: {
            labels: lastSixMonths,
            datasets: [{
                label: 'Revenue (KES)',
                data: lastSixMonths.map(month => monthlyRevenue[month]),
                backgroundColor: 'rgba(79, 70, 229, 0.8)',
                borderRadius: 4,
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
    });
};

onMounted(renderChart);
watch(() => props.invoices, renderChart, { deep: true });
</script>