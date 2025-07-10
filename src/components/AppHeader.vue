<template>
  <div class="header">
    <div class="logo">InvoiceFlow</div>
    <div class="nav-menu">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="nav-btn"
        :class="{ active: activeTab === tab.id }"
        @click="navigate(tab.id)"
      >
        {{ tab.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activeTab: String
});

const emit = defineEmits(['navigate']);

const tabs = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'invoices', name: 'Invoices' },
  { id: 'clients', name: 'Clients' },
  { id: 'reports', name: 'Reports' },
  { id: 'settings', name: 'Settings' }
];

const navigate = (tabId) => {
  emit('navigate', tabId);
};
</script>