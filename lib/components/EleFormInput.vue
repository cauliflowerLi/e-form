<template>
  <el-form-item
    :class="desc.class"
    :style="desc.style"
    :prop="field"
    :label="label"
    :rules="rule"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot name="before" />
    <slot><el-input v-model="newValue" @input="inputChange" /></slot>
    <slot name="after" />
  </el-form-item>
</template>
<script>
export default {
  name: 'ele-form-input',
  inheritAttrs: false,
  props: {
    value: {
      type: String || Number,
      default: ''
    },
    desc: {
      type: Object,
      default: () => ({
        class: '',
        style: {}
      })
    },
    field: {
      type: String,
      default: '',
      required: true
    },
    label: {
      type: String,
      default: '',
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    rule: {
      type: Object,
      default: () => ({})
    }
  },
  data: function () {
    return {
      newValue: this.value
    }
  },
  method: {
    inputChange: (value) => {
      this.$emits('input', field, value) // 更新父组件的 formData
    }
  }
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
