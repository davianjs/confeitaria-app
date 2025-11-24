<template>
  <Modal v-if="isOpen" @click.self="handleCancel">
    <ModalContent @click.stop class="max-w-md">
      <div class="p-4 md:p-6">
        <div class="flex items-start gap-3 md:gap-4 mb-4">
          <div :class="iconClasses" class="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center">
            <span class="material-symbols-outlined text-xl md:text-2xl">{{ icon }}</span>
          </div>
          <div class="flex-1">
            <h3 class="text-base md:text-lg font-semibold text-gray-800 mb-2">{{ title }}</h3>
            <p class="text-sm text-gray-600">{{ message }}</p>
          </div>
        </div>

        <div class="flex gap-2 md:gap-3">
          <Button 
            v-if="type === 'confirm'"
            type="button" 
            variant="secondary" 
            @click="handleCancel" 
            fullWidth
          >
            Cancelar
          </Button>
          <Button 
            type="button" 
            :variant="confirmVariant"
            @click="handleConfirm" 
            fullWidth
          >
            {{ confirmText }}
          </Button>
        </div>
      </div>
    </ModalContent>
  </Modal>
</template>

<script setup>
import { computed } from 'vue';
import { Modal, ModalContent, Button } from './StyledComponents';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'confirm', // 'confirm', 'alert', 'error', 'success'
    validator: (value) => ['confirm', 'alert', 'error', 'success'].includes(value)
  },
  title: {
    type: String,
    default: 'Confirmar ação'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirmar'
  },
  variant: {
    type: String,
    default: 'danger' // 'danger', 'primary', 'success'
  }
});

const emit = defineEmits(['confirm', 'cancel']);

const icon = computed(() => {
  if (props.type === 'error') return 'error';
  if (props.type === 'success') return 'check_circle';
  if (props.type === 'alert') return 'info';
  return 'help';
});

const iconClasses = computed(() => {
  if (props.type === 'error') return 'bg-red-100 text-red-600';
  if (props.type === 'success') return 'bg-green-100 text-green-600';
  if (props.type === 'alert') return 'bg-blue-100 text-blue-600';
  return 'bg-yellow-100 text-yellow-600';
});

const confirmVariant = computed(() => {
  if (props.variant === 'success') return 'success';
  if (props.variant === 'primary') return 'primary';
  return 'danger';
});

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  emit('cancel');
};
</script>
