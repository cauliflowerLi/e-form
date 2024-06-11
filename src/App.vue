<script setup lang="ts">
import EleForm from '../lib/Ele-Form.vue'
import { ref, reactive, computed } from 'vue'

const formData = reactive({
  email: '1137404046@qq.com'
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
      message: 'Please input email address',
      trigger: 'blur'
    },
    {
      type: 'email',
      message: 'Please input correct email address',
      trigger: ['blur', 'change']
    }
  ],
  address: [
    {
      required: true,
      message: 'Please input email address',
      trigger: 'blur'
    },
    {
      type: 'email',
      message: 'Please input correct email address',
      trigger: ['blur', 'change']
    }
  ]
})
const formDesc = computed(() => {
  return {
    email: {
      type: 'input',
      label: '邮箱',
      layout: 12,
      default: 8,
      vif: true,
      disabled: true,
      rules: {
        required: true,
        trigger: 'blur',
        message: '必须填写邮箱'
      }
    },
    phone: {
      type: 'input',
      label: '手机',
      layout: 12,
      default: 8,
      vif: true,
      disabled: true,
      rules: {
        required: true,
        trigger: 'blur',
        message: '必须填写手机'
      }
    },
    address: {
      type: 'input',
      label: '地址',
      layout: 12,
      default: 8,
      vif: true,
      disabled: true,
      rules: {
        required: true,
        trigger: 'blur',
        message: '必须填写地址'
      }
    },
    test: {
      type: 'show',
      label: '测试',
      layout: 12,
      default: 8,
      vif: true,
      disabled: true,
      rules: {
        required: true,
        trigger: 'blur',
        message: '必须填写地址'
      }
    }
  }
})
</script>

<template>
  <main>
    <ele-form
      :formData="formData"
      :formDesc="formDesc"
      :rules="rules"
      :disabled="false"
      inline
      :labelWidth="120"
      labelPosition="right"
    >
      <span>我是默认插槽内容</span>
      <template #form-footer>
        <span>我是页脚插槽内容</span>
      </template>
    </ele-form>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
