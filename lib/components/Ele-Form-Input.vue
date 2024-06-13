<template>
  <el-input
    v-bind="defaultAttrs"
    :class="props.desc.class"
    :style="props.desc.style"
    v-model.trim="newValue"
    v-on="props.desc.on"
    @input="handleChange"
  >
    <template v-if="$slots.prefix" #prefix><slot name="prefix" /></template>
    <template v-if="$slots.suffix" #suffix><slot name="suffix" /></template>
    <template v-if="$slots.prepend" #prepend><slot name="prepend" /></template>
    <template v-if="$slots.append" #append><slot name="append" /></template>
  </el-input>
</template>
<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
defineOptions({
  inheritAttrs: false
})
const emit = defineEmits(['input', 'update:modelValue'])
interface Props {
  desc: object
  options?: object
  field: string
  disabled?: boolean
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  desc: () => ({ class: 'test', style: { width: '200px' } }),
  options: () => ({}),
  field: '',
  disabled: false,
  readonly: false
})
const newValue = defineModel()

const $attrs = useAttrs()
const defaultAttrs = computed(() => {
  const desc = { ...props.desc }
  desc['aria-label'] = desc.label
  delete desc.label
  return {
    ...desc,
    ...$attrs,
    // placeholder: this.t('ele-form.input') + props.desc.label
    placeholder: '请输入' + desc['aria-label']
  }
})
const handleChange = (field: string, val: any): void => {
  if (props.desc.toUpperCase) {
    val = val.toUpperCase()
  }
  if ($attrs.isSearchForm) {
    return
  }
  if ($attrs.type === 'number' && val) {
    val = Number(val)
  }
  emit('input', field, val)
}
</script>
<style lang="scss" scoped></style>
