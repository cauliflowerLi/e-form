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
              <template v-for="(value, field) in Desc" :key="'component' + field">
                <Component
                  :is="value._type"
                  v-if="!disabled && value.vif"
                  :disabled="value.disabled"
                  :value="formData[field]"
                  :label="value.label"
                  :field="field"
                  v-bind="value"
                />
              </template>
            </el-row>
          </slot>
          <slot name="form-footer"></slot>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ele-form',
  props: {
    formData: {
      type: Object,
      default: () => ({})
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    },
    labelPosition: {
      type: String,
      default: 'right'
    },
    labelWidth: {
      type: String || Number,
      default: '120px'
    },
    formDesc: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    Desc: function () {
      const desc = this.formDesc
      Object.keys(desc).forEach((key) => {
        let type = desc[key].type
        desc[key]._type = 'ele-form-' + type
      })
      return desc
    }
  }
}
</script>

<style></style>
