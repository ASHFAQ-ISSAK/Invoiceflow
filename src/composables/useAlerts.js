import { ref } from 'vue';

const alert = ref({ show: false, type: '', message: '' });

export function useAlerts() {
    const showAlert = (type, message, duration = 3000) => {
        alert.value = { show: true, type, message };
        setTimeout(() => {
            alert.value.show = false;
        }, duration);
    };

    return { alert, showAlert };
}