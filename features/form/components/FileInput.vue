<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

const props = defineProps<{
  modelValue: File | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: File | null): void;
}>();

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  emit("update:modelValue", file || null);
}

function handleFileDrop(event: DragEvent) {
  const dataTransfer = event.dataTransfer as DataTransfer;
  const file = dataTransfer.files[0];

  emit("update:modelValue", file || null);
}

const events = ["dragenter", "dragover", "dragleave", "drop"];

onMounted(() => {
  events.forEach((eventName) => {
    document.body.addEventListener(eventName, preventDefaults);
  });
});

onUnmounted(() => {
  events.forEach((eventName) => {
    document.body.removeEventListener(eventName, preventDefaults);
  });
});

function preventDefaults(e: Event) {
  e.preventDefault();
}
</script>

<template>
  <label
    @drop.prevent="handleFileDrop"
    class="block text-sm font-medium leading-6 text-gray-900"
  >
    <slot name="label"></slot>

    <div
      class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
    >
      <div class="text-center">
        <svg
          class="mx-auto h-12 w-12 text-gray-300"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
            clip-rule="evenodd"
          />
        </svg>
        <div
          v-if="!modelValue"
          class="mt-4 flex text-sm leading-6 text-gray-600"
        >
          <label
            class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
          >
            <span> Upload a file </span>
            <input @input="handleFileChange" type="file" class="sr-only" />
          </label>
          <p class="pl-1">or drag and drop</p>
        </div>

        <div v-else class="mt-4 flex gap-2 text-sm leading-6 text-gray-600">
          <p class="pl-1">{{ modelValue.name }}</p>
          <button
            @click="emit('update:modelValue', null)"
            class="rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
          >
            clear
          </button>
        </div>
      </div>
    </div>
  </label>
</template>
