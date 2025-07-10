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

    const statusCounts = {
        paid: props.invoices.filter(i => i.status === 'paid').length,
        sent: props.invoices.filter(i => i.status === 'sent').length,
        overdue: props.invoices.filter(i => i.status === 'overdue').length,
        draft: props.invoices.filter(i => i.status === 'draft').length
    };

    chartInstance = new Chart(chartCanvas.value, {
        type: 'pie',
        data: {
            labels: ['Paid', 'Pending', 'Overdue', 'Draft'],
            datasets: [{
                data: [statusCounts.paid, statusCounts.sent, statusCounts.overdue, statusCounts.draft],
                backgroundColor: ['#d1fae5', '#dbeafe', '#fee2e2', '#fef3c7'],
                borderColor: ['#065f46', '#1e40af', '#991b1b', '#92400e'],
                borderWidth: 1
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
};

onMounted(renderChart);
watch(() => props.invoices, renderChart, { deep: true });
</script>