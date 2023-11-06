<script setup lang="ts">
const props = defineProps<{
  modelValue: string | number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>

<template>
  <label class="block text-sm font-medium leading-6 text-gray-900">
    <slot name="label"></slot>

    <input
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      v-bind="$attrs"
      :value="modelValue"
      class="mt-2 w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    />
  </label>
</template>
