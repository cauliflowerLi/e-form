<template>
  <div class="form-wrapper">
    <el-row justify="space-between" type="flex">
      <el-col :span="24">
        <el-form
          ref="formRef"
          :model="props.formData"
          :rules="props.rules"
          class="demo-dynamic"
          :inline="props.inline"
          :disabled="props.disabled"
          :label-position="props.labelPosition"
          :label-width="props.labelWidth"
        >
          <el-form-item>
            <el-button type="primary" @click="submitForm(formRef)">提交</el-button>
            <el-button @click="resetForm(formRef)">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
interface Props {
  formData: object
  rules: object
  disabled?: boolean
  inline?: boolean
  labelPosition?: string
  labelWidth?: number | string
}
const props = withDefaults(defineProps<Props>(), {
  formData: () => ({}),
  rules: () => ({}),
  disabled: false,
  inline: false,
  labelPosition: 'right',
  labelWidth: '120px'
})
console.log(props)
const formRef = ref()

const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!')
    }
  })
}

const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style></style>
