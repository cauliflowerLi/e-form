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
          <ele-form-input>
            <template #prefix>prefix</template>
            <template #suffix>suffix</template>
            <template #prepend>prepend</template>
            <template #append>append</template>
          </ele-form-input>
          <!--          <slot name="form-content">
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
          </slot>-->
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
import type { FormInstance, FormRules } from 'element-plus'
import EleFormInput from './components/Ele-Form-Input.vue'

/**
 * 单个表单字段描述项中的校验规则接口
 */
interface rulesOption {
  required: boolean
  message: string
  trigger?: string
  validator?: (rule: any, value: any, callback: any) => void
}
/**
 * 单个表单字段描述项接口
 */
interface descOptionS {
  type: string
  label: string
  rules: rulesOption[]
  layout?: number
  default?: number
  vif?: boolean
  disabled?: boolean
}

/**
 * 所有表单项的描述接口
 */
interface descOptionB {
  [key: string]: descOptionS
}

/**
 * 表单所有字段value接口
 */
interface formDataOption {
  [field: string]: any
}

/**
 * 表单组件的props接口
 */
interface Props {
  formData: formDataOption
  rules: FormRules
  formDesc: descOptionB
  disabled?: boolean
  inline?: boolean
  labelPosition?: string
  labelWidth?: string
}

/**
 * 表单组件props默认值
 */
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
const rules = reactive<FormRules<typeof formData>>(props.rules)
const formDesc = reactive(props.formDesc)
const desc = computed(() => {
  Object.keys(formDesc).forEach((key) => {
    let type = formDesc[key].type
    formDesc[key]._type = 'ele-form-' + type
  })
  return formDesc
})
const setField = (field, val) => {
  formData[field] = val
  console.log(formData.value)
}
const submit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!')
    }
  })
}
</script>

<style></style>
