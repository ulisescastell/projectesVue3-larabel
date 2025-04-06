<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, required: true }
})

const emit = defineEmits(['update:modelValue'])

const inputValue = ref(props.modelValue)

watch(inputValue, (newVal) => {
  emit('update:modelValue', newVal) 
})

watch(() => props.modelValue, (newVal) => {
  inputValue.value = newVal
})
</script>

<template>
  <div class="relative">
    <IconSearch class="w-3 absolute top-[50%] translate-y-[-50%] left-2 opacity-30" />
    <input type="text" placeholder="Search" class="pl-10 p-2 rounded" v-model="inputValue" @keydown.enter.prevent />
  </div>
</template>
