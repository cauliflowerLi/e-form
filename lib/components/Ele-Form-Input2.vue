<template>
  <el-form-item
    :class="desc.class"
    :style="desc.style"
    :prop="field"
    :label="label"
    :rules="rule"
    v-bind="$attrs"
  >
    <slot name="before" />
    <slot><el-input v-model="newValue" @input="inputChange" v-bind="$attrs" /></slot>
    <slot name="after" />
  </el-form-item>
</template>
<script setup lang="ts">
import { ref, useAttrs } from 'vue'
defineOptions({
  inheritAttrs: false
})
const emit = defineEmits(['input'])
interface Props {
  value: string | number
  desc: object
  rule: object
  field: string
  label: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  desc: () => ({ class: '', style: {} }),
  rule: () => ({}),
  field: '',
  label: '',
  disabled: false
})

const newValue = ref(props.value)
const $attrs = useAttrs()
const inputChange = (field: string, value: any): void => {
  emit('input', field, value)
}
</script>
<style lang="scss" scoped>
.formitme {
  display: flex;
}
</style>
<style lang="scss">
.el-form {
  .el-form-item__content {
    display: flex;
  }
  .el-input {
    flex: 1;
  }
}
</style>
