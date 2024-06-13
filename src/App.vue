<script setup lang="ts">
import EleForm from '../lib/Ele-Form.vue'
import { ref, reactive, computed } from 'vue'

const formData = reactive({
  email: '',
  phone: 15158112232
})
const rules = reactive({
  email: [
    {
      required: true,
      message: '请输入邮箱地址',
      trigger: 'blur'
    },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change']
    }
  ],
  phone: [
    {
      required: true,
      message: '请输入手机号码',
      trigger: 'blur'
    }
  ],
  address: [
    {
      required: true,
      message: '请输入地址',
      trigger: 'blur'
    }
  ]
})
const formDesc = computed(() => {
  return {
    email: {
      type: 'input',
      label: '邮箱',
      layout: 8,
      default: 8,
      vif: true,
      disabled: false,
      class: ['test'],
      style: { width: '100%' },
      on: {
        click: () => {
          console.log(2)
        }
      },
      rules: {
        required: true,
        trigger: 'blur',
        message: '必须填写邮箱'
      }
    },
    phone: {
      type: 'input',
      label: '手机',
      layout: 8,
      default: 8,
      vif: true,
      style: { width: '100%' },
      disabled: false,
      on: {
        click: () => {
          console.log(2)
        }
      },
      rules: {
        required: true,
        trigger: 'blur',
        message: '必须填写手机'
      }
    },
    address: {
      type: 'input',
      label: '地址',
      layout: 8,
      default: 8,
      vif: true,
      style: { width: '100%' },
      disabled: false,
      on: {
        click: () => {
          console.log(2)
        }
      },
      rules: {
        required: true,
        trigger: 'blur',
        message: '必须填写地址'
      }
    },
    test: {
      type: 'show',
      label: '测试',
      layout: 16,
      default: 8,
      vif: true,
      style: { width: '100%' },
      disabled: false,
      on: {
        click: () => {
          console.log(2)
        }
      },
      rules: {
        required: true,
        trigger: 'blur',
        message: '必须填写地址'
      }
    }
  }
})
const disabled = ref(false)
const switchState = () => {
  disabled.value = !disabled.value
}
// eslint-disable-next-line no-alert, no-console
const formBtns = reactive([
  {
    type: 'primary',
    text: '自定义按钮',
    click: () => {
      console.log('测试事件')
    }
  },
  {
    type: 'success',
    text: '自定义按钮',
    click: () => {
      console.log('测试事件')
    }
  },
  {
    type: 'info',
    text: '自定义按钮',
    click: () => {
      console.log('测试事件')
    }
  },
  {
    type: 'danger',
    text: '自定义按钮',
    click: () => {
      console.log('测试事件')
    }
  }
])
const beforeValidate = async (params: object) => {
  console.log(params)
  return true
}
const request = (result: object) => {
  console.log(result)
}
</script>

<template>
  <main>
    <el-button v-if="false" @click="switchState">{{ disabled ? '禁用' : '启用' }}</el-button>
    <ele-form
      :formData="formData"
      :formDesc="formDesc"
      :rules="rules"
      :disabled="disabled"
      inline
      :labelWidth="120"
      labelPosition="right"
      :span="24"
      :btnSpan="16"
      :request="request"
      size="default"
      :beforeValidate="beforeValidate"
    >
    </ele-form>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
}
</style>
