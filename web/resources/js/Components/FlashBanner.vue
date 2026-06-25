<script setup>
import { ref, watch, onUnmounted } from 'vue';
import { usePage } from '@inertiajs/vue3';

const page = usePage();

const visible = ref(false);
const message = ref('');
const type = ref('');

let dismissTimer = null;

const show = (msg, msgType) => {
    message.value = msg;
    type.value = msgType;
    visible.value = true;

    clearTimeout(dismissTimer);
    dismissTimer = setTimeout(() => {
        visible.value = false;
    }, 4000);
};

const dismiss = () => {
    visible.value = false;
    clearTimeout(dismissTimer);
};

// Watches Inertia's shared flash props — fires whenever a new flash message arrives
watch(
    () => page.props.flash,
    (flash) => {
        if (flash?.success) {
            show(flash.success, 'success');
        } else if (flash?.error) {
            show(flash.error, 'error');
        }
    },
    { immediate: true, deep: true }
);

onUnmounted(() => {
    clearTimeout(dismissTimer);
});
</script>

<template>
    <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
    >
        <div
            v-if="visible"
            class="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
        >
            <div
                class="flex items-start justify-between gap-3 rounded-lg shadow-md px-4 py-3 text-sm"
                :class="type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'"
            >
                <span>{{ message }}</span>
                <button
                    type="button"
                    @click="dismiss"
                    class="shrink-0 text-current opacity-60 hover:opacity-100"
                    aria-label="Dismiss"
                >
                    ✕
                </button>
            </div>
        </div>
    </Transition>
</template>