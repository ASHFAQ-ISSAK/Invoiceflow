<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import AppHeader from './components/AppHeader.vue';
import { useAlerts } from './composables/useAlerts.js';
import { useInvoices } from './composables/useInvoices.js';
import { useClients } from './composables/useClients.js';

// Import all your views
import DashboardView from './views/DashboardView.vue';
import InvoicesView from './views/InvoicesView.vue';
import ClientsView from './views/ClientsView.vue';
import ReportsView from './views/ReportsView.vue';
import SettingsView from './views/SettingsView.vue';

const { alert } = useAlerts();
// FIX: Removed 'updateInvoiceStatuses' as it no longer exists
const { fetchInvoices } = useInvoices(); 
const { fetchClients } = useClients();

// Fetch all data when the app is first mounted
onMounted(() => {
  fetchClients();
  fetchInvoices();
});

const activeTab = ref(localStorage.getItem('activeTab') || 'dashboard');

const views = {
  dashboard: DashboardView,
  invoices: InvoicesView,
  clients: ClientsView,
  reports: ReportsView,
  settings: SettingsView
};

const activeView = computed(() => views[activeTab.value]);

watch(activeTab, (newTab) => {
  localStorage.setItem('activeTab', newTab);
  // FIX: This line has been removed
});
</script>

<template>
  <div class="container">
    <AppHeader :active-tab="activeTab" @navigate="activeTab = $event" />

    <div v-if="alert.show" :class="`alert alert-${alert.type}`">
      {{ alert.message }}
    </div>

    <main>
      <component :is="activeView" />
    </main>
  </div>
</template>