<template>
    <div class="card kpi-card">
        <div class="kpi-value">
            <i :class="['material-icons', iconClass]">{{ iconName }}</i>
            <span>{{ value }}</span>
        </div>
        <div class="kpi-label">{{ label }}</div>
    </div>
</template>

<script setup>
defineProps({
    iconName: String,
    iconClass: String,
    value: String,
    label: String,
});
</script>