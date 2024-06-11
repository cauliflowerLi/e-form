<template>
  <div class="form-wrapper">
    <el-row justify="space-between" type="flex">
      <el-col :span="24">
        <el-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          class="demo-dynamic"
          :inline="inline"
          :disabled="disabled"
          :label-position="labelPosition"
          :label-width="labelWidth"
        >
          <slot></slot>
          <slot name="form-content">
            <el-row :gutter="20">
              <template v-for="(value, field) in desc" :key="'component' + field">
                <Component
                  :is="value._type"
                  v-if="!disabled && value.vif"
                  :disabled="value.disabled"
                  :value="formData[field]"
                  :label="value.label"
                  :field="field"
                  v-bind="value"
                  @input="setField(field, $event)"
                />
              </template>
            </el-row>
          </slot>
          <slot name="form-footer"></slot>
          <slot name="btns">
            <el-button type="primary" @click="submit">保存</el-button>
            <el-button>重置</el-button>
          </slot>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { capitalizeFirstLetter } from './tool/tool'
interface Props {
  formData: object
  rules: object
  formDesc: object
  disabled?: boolean
  inline?: boolean
  labelPosition?: string
  labelWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  formData: () => ({}),
  rules: () => ({}),
  formDesc: () => ({}),
  disabled: false,
  inline: true,
  labelPosition: 'right',
  labelWidth: '120px'
})

const formData = reactive(props.formData)
const rules = reactive(props.rules)
const formDesc = reactive(props.formDesc)
const desc = computed(() => {
  Object.keys(formDesc).forEach((key) => {
    let type = formDesc[key].type
    formDesc[key]._type = 'ele-form-' + type
  })
  return formDesc
})
console.log(desc.value)
const setField = function (field, val) {
  this.set(formData, field, val)
}
const submit = () => {
  console.log(formData)
}
</script>

<style></style>
