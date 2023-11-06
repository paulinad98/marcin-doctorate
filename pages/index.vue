<script setup lang="ts">
import { ref } from "vue";
import FileInput from "@/features/form/components/FileInput.vue";
import BaseInput from "@/features/form/components/BaseInput.vue";
import { downloadFile } from "@/features/form/utils/downloadFile";

type WaveNumberForm = {
  minWaveNumber: number;
  maxWaveNumber: number;
  oddFile: File | null;
  evenFile: File | null;
};

const form = ref<WaveNumberForm>({
  minWaveNumber: 0,
  maxWaveNumber: 0,
  oddFile: null,
  evenFile: null,
});

async function handleFormSubmit() {
  if (
    !form.value.oddFile ||
    !form.value.evenFile ||
    !form.value.minWaveNumber ||
    !form.value.maxWaveNumber
  ) {
    return;
  }

  const formData = new FormData();

  formData.append("oddFile", form.value.oddFile);
  formData.append("evenFile", form.value.evenFile);
  formData.append("minWaveNumber", form.value.minWaveNumber.toString());
  formData.append("maxWaveNumber", form.value.maxWaveNumber.toString());

  const { data, error } = await useFetch("/api/wave-numbers", {
    method: "post",
    body: formData,
  });

  if (error.value) {
    console.log(error);
    return;
  } else if (typeof data.value !== "string") {
    console.log("data is not string");
    return;
  }

  const file = new Blob([data.value], { type: "text/plain" });
  downloadFile(file, "wave-numbers.txt");
}
</script>

<template>
  <form @submit.prevent="handleFormSubmit" class="max-w-4xl mx-auto p-10">
    <h2 class="text-base font-semibold leading-7 text-gray-900">
      Combine odd a even
    </h2>
    <p class="mt-1 text-sm leading-6 text-gray-600">
      This information will be displayed publicly so be careful what you share.
    </p>

    <FileInput v-model="form.oddFile" class="mt-3">
      <template #label> Odd file </template>
    </FileInput>

    <FileInput v-model="form.evenFile" class="mt-3">
      <template #label> Even file </template>
    </FileInput>

    <BaseInput v-model="form.minWaveNumber" type="number" class="mt-3">
      <template #label> Min Wave number </template>
    </BaseInput>

    <BaseInput v-model="form.maxWaveNumber" type="number" class="mt-3">
      <template #label> Max Wave number </template>
    </BaseInput>

    <button
      type="submit"
      class="mx-auto mt-6 block rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      Save
    </button>
  </form>
</template>
