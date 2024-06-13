<template>
  <div ref="wrapper" :class="[{ 'ele-form--inline': inline }]" class="ele-form">
    <el-row justify="center" type="flex">
      <el-col :span="computedSpan">
        <el-form
          ref="formRef"
          class="form"
          v-bind="$attrs"
          :model="formData"
          :rules="$props.rules"
          :inline="$props.inline"
          :size="$props.size"
          :disabled="$props.disabled"
          :label-position="$props.labelPosition"
          :label-width="$props.labelWidth"
          :validate-on-rule-change="false"
          label-suffix="："
          @submit.prevent="handleSubmitForm"
        >
          <slot></slot>
          <el-row :gutter="0">
            <slot :formData="formData" :formDesc="desc" :props="$props" name="form-content">
              <template v-for="(formItem, field) of desc">
                <slot
                  :data="formData[field]"
                  :desc="formItem"
                  :disabled="formItem.disabled"
                  :field="field"
                  :formData="formData"
                  :name="field + '-wrapper'"
                  :options="formItem.options"
                  :props="$props"
                  :type="formItem.type"
                >
                  <el-col v-if="formItem.vif" :key="field" v-bind="formItem.colAttrs">
                    <el-form-item
                      :error="formErrorObj ? formErrorObj[field] : null"
                      :label="desc[field].label"
                      :label-width="formItem.labelWidth || null"
                      :prop="field"
                      :inline-message="false"
                    >
                      <slot
                        :data="formData[field]"
                        :desc="formItem"
                        :disabled="formItem.disabled"
                        :field="field"
                        :formData="formData"
                        :name="field"
                        :options="formItem.options"
                        :props="$props"
                        :type="formItem.type"
                      >
                        <component
                          :is="formItem._type"
                          v-if="!disabled && !formItem.disabled"
                          :ref="field"
                          :desc="formItem"
                          :disabled="formItem.disabled"
                          :field="field"
                          :model="formData"
                          :options="formItem.options"
                          :readonly="formItem.readonly"
                          :value="formData[field]"
                          v-on="formItem.on"
                          @input="setField(field, $event)"
                        ></component>
                        <div v-else class="form-item-content">
                          <span
                            v-if="
                              !formData || (!formData[field] && typeof formData[field] !== 'number')
                            "
                          >
                            暂无
                          </span>
                          <span v-else>
                            {{ formData[field] }}
                          </span>
                        </div>
                      </slot>
                      <div v-if="formItem.tip" class="ele-form-tip" v-html="formItem.tip"></div>
                    </el-form-item>
                  </el-col>
                </slot>
              </template>
            </slot>
            <!--操作按钮-->
            <el-col v-if="btns.length" :span="inline ? $attrs.btnSpan : 24" class="ele-form-btns">
              <el-form-item :label-width="inline ? '10px' : null">
                <!--按钮插槽-->
                <slot :btns="btns" name="form-btn">
                  <el-button
                    v-for="(btn, index) of btns"
                    :key="index"
                    v-bind="btn.attrs"
                    @click="btn.click"
                    >{{ btn.text }}</el-button
                  >
                </slot>
              </el-form-item>
            </el-col>
          </el-row>
          <slot name="form-footer"></slot>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { is } from './tool/tool'
import { cloneDeep } from 'lodash-es'
import { useRoute } from 'vue-router'
import type { FormRules } from 'element-plus'

const route = useRoute()
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
  type: string //表单项使用的组件类型
  label: string //表单项label名称
  rules: rulesOption[]
  layout?: number //表单项占据的span数
  default?: number //设置表单项初始默认值：还未实现
  vif?: boolean //表单项是否显示
  readonly?: boolean //表单项是否只读：还未实现
  disabled?: boolean //表单项是否禁用
  toUpperCase?: boolean //表单项是否内容转大写：还未实现
  options?: object //如果有需要通过作用域插槽传给父组件调用的可以通过该属性追加配置进去
  labelWidth?: string | number //label标签的宽度
  handleEmit?: object //表单组件需要绑定的事件
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
 * 该接口不会使用，只做说明：说明form组件用到了哪些自定义属性
 */
// eslint-disable-next-line no-alert, no-console
interface attrs {
  btnSpan?: number //按钮操作的el-col组件的span值
}

interface btnOption {
  type: string //按钮的type类型，如：primary、error、info、success等
  text: string //按钮的文本内容
  click: () => void //按钮的点击事件
}

const $emit = defineEmits([
  //'before-validate', //el-form保存前自定义校验函数：返回结果为boolean值：true校验通过，false校验失败
  // 'before-request', //el-form保存前格式化接口参数的函数：返回结果为false不执行格式化，否则返回格式化的数据对象
  // 'request', //①el-form接口调用无论成功还是失败以后的回调:成功或者失败的处理逻辑在外部request方法后续自定义
  // 'requestFn', //②el-form正式保存的接口函数：成功或者失败的处理逻辑需要传入下述相关回调函数名接收数据即可②比①优先级高，即如果传入了②函数名则不会再执行①
  // 'request-success', //el-form接口调用成功以后的回调，参数是成功后接口返回的值
  // 'request-error', ////el-form接口调用失败以后的回调，参数是失败后接口返回的值
  // 'request-end', //el-form接口调用无论成功还是失败以后的回调
  'reset', //重置表单时需要对父组件进行的一些操作：表单的重置操作已经在按钮的重置方法里面完成了，这个重置只是对父组件的需要处理进行操作
  'update:modelValue' //无需配置调用，v-model="formData"时自带的方法
])

/**
 * 表单组件的props接口
 */
interface Props {
  // formData: formDataOption //表单el-form的model
  rules: FormRules //表单el-form的rule
  formDesc: descOptionB //生成表单所有项的描述
  disabled?: boolean //是否禁用el-form
  inline?: boolean //是否inline显示el-form
  labelPosition?: string //el-form的label显示位置：默认right
  labelWidth?: string //el-form的label占据的css宽度：默认120px
  size?: string //el-form的size
  span?: number //el-form最直接的el-col的span占据：用来控制整体表单内容的span宽度
  btnSpan?: number //自定义按钮组的el-col的span宽度
  isShowSubmitBtn?: boolean //是否显示保存按钮：默认显示
  submitBtnText?: string //保存按钮的文本内容：默认保存
  isLoading?: boolean //保存时加载中状态：默认false;还未实现
  isShowBackBtn?: boolean //是否显示返回按钮：默认不显示
  isShowResetBtn?: boolean //是否显示重置按钮：默认显示
  resetBtnText: string //重置按钮的文本内容：默认重置
  isDialog?: boolean //当前el-form是否是dialog的形式：还未实现
  backBtnText?: string //返回按钮的默认文本：默认返回
  formBtns?: btnOption[] //自定义按钮组，每项含参见接口。如果开启了保存和返回等按钮配置项，则该选项中无需再有。他们之间是合并的关系而不是覆盖
  beforeValidate?: Function //el-form保存前自定义校验函数：返回结果为boolean值：true校验通过，false校验失败
  beforeRequest?: Function //el-form保存前格式化接口参数的函数：返回结果为false不执行格式化，否则返回格式化的数据对象
  request?: Function //①el-form接口调用无论成功还是失败以后的回调:成功或者失败的处理逻辑在外部request方法后续自定义
  requestFn?: Function //②el-form正式保存的接口函数：成功或者失败的处理逻辑需要传入下述相关回调函数名接收数据即可②比①优先级高，即如果传入了②函数名则不会再执行①
  requestSuccess?: Function //el-form接口调用成功以后的回调，参数是成功后接口返回的值
  requestError?: Function //el-form接口调用失败以后的回调，参数是失败后接口返回的值
  requestEnd?: Function //el-form接口调用无论成功还是失败以后的回调
}
/**
 * 表单组件props默认值
 */
const props = withDefaults(defineProps<Props>(), {
  // formData: () => ({}),
  rules: () => ({}),
  formDesc: () => ({}),
  disabled: false,
  inline: true,
  labelPosition: 'right',
  labelWidth: '120px',
  size: 'default',
  span: 24,
  isLoading: false,
  isDialog: false,
  isShowBackBtn: false,
  backBtnText: '返回',
  isShowSubmitBtn: true,
  submitBtnText: '保存',
  isShowResetBtn: true,
  resetBtnText: '重置',
  btnSpan: 16,
  formBtns: () => [],
  beforeValidate: (p: object) => Promise,
  beforeRequest: (p: object) => Promise,
  request: (p: object) => Promise,
  requestFn: (p: object) => Promise,
  requestSuccess: (p: object) => Promise,
  requestError: (p: object) => Promise,
  requestEnd: () => Promise
})
const formData = defineModel()

const formDesc = reactive(props.formDesc)
const desc = computed(() => {
  Object.keys(formDesc).forEach((field) => {
    let type = formDesc[field].type
    formDesc[field]._type = 'ele-form-' + type // layout值, 内部属性不显示
    formDesc[field].colAttrs = getColAttrs(formDesc[field].layout)
  })
  return formDesc
})
const formErrorObj = reactive({})
const innerIsLoading = ref(false) // 是否正在请求中
const innerFormError = ref('') //接口保存失败的错误信息
let parentElWidth = ref(0)
const colEnum = reactive({
  xs: 24,
  sm: 18,
  md: 16,
  lg: 14,
  xl: 12
})
const formRef = ref(null)

const computedSubmitBtnText = computed(() => {
  if (is(props.submitBtnText, 'String')) {
    return props.submitBtnText
  } else {
    //return props.inline ? t('ele-form.submitBtnTextInline') : t('ele-form.submitBtnText')
    return props.inline ? '这里使用预定义文本' : '这里使用预定义文本'
  }
})
// 是否显示返回按钮(inline和layout模式下不同)
const computedIsShowBackBtn = computed(() => {
  if (is(props.isShowBackBtn, 'Boolean')) {
    return props.isShowBackBtn
  } else {
    return !(props.inline || props.isDialog)
  }
})
// 按钮
const btns = computed(() => {
  const formBtnSize = props.size
  let btns = []
  // 模拟数据
  /*if (this.isMock) {
    btns.push({
      attrs: {
        type: 'primary',
        size: formBtnSize
      },
      text: t('ele-form.mockBtnText'),
      click: this.reMockData
    })
  }*/

  // 提交按钮
  if (props.isShowSubmitBtn) {
    btns.push({
      attrs: {
        type: 'primary',
        size: formBtnSize,
        loading: props.isLoading || innerIsLoading.value,
        'native-type': 'submit'
      },
      text: computedSubmitBtnText.value,
      click() {}
    })
  }

  // 自定义按钮
  if (props.formBtns) {
    const customBtns = props.formBtns.map((btn) => ({
      attrs: {
        type: btn.type,
        size: formBtnSize
      },
      text: btn.text,
      click: btn.click
    }))
    btns = [...btns, ...customBtns]
  }

  // 返回按钮
  if (computedIsShowBackBtn.value) {
    btns.push({
      attrs: {
        size: formBtnSize
      },
      // text: this.backBtnText || t('ele-form.backBtnText'),
      text: props.backBtnText || '预定义返回按钮文本',
      click: goBack
    })
  }

  // 取消按钮
  /*if (this.computedIsShowCancelBtn) {
    btns.push({
      attrs: {
        size: formBtnSize
      },
      text: this.cancelBtnText || t('ele-form.cancelBtnText'),
      click: this.handleCancelClick
    })
  }*/

  // 重置按钮
  if (props.isShowResetBtn) {
    btns.push({
      attrs: {
        size: formBtnSize
      },
      // text: props.resetBtnText || t('ele-form.resetBtnText'),
      text: props.resetBtnText || '重置',
      click: resetForm
    })
  }

  // 收缩按钮
  /*if (this.isShowCollapseBtn) {
    btns.push({
      attrs: {
        type: 'text',
        size: formBtnSize,
        icon: this.isCollapseForm ? 'el-icon-arrow-down' : 'el-icon-arrow-up'
      },
      text: this.collapseBtnText || t('ele-form.collapseBtnText'),
      click: this.collapseForm
    })
  }*/
  return btns
})
const computedIsResponsive = computed(() => {
  return !(props.inline || !props.isResponsive)
})
const computedSpan = computed(() => {
  // 如果设置了span, 则使用设置的
  if (props.span) {
    return props.span
    // 如果是响应式, 则使用响应式计算的宽度
  } else if (computedIsResponsive.value) {
    return colEnum[colLayout.value]
  } else {
    // 获取时默认值
    return props.inline ? props.inlineDefaultSpan : props.layoutDefaultSpan
  }
})
const colLayout = computed(() => {
  if (parentElWidth.value > 1920) {
    return 'xl'
  } else if (parentElWidth.value > 1200) {
    return 'lg'
  } else if (parentElWidth.value > 992) {
    return 'md'
  } else if (parentElWidth.value > 768) {
    return 'sm'
  } else {
    return 'xs'
  }
})
const formDescKeys = computed(() => {
  return Object.keys(props.formDesc)
})
const getColAttrs = (layout) => {
  return props.inline
    ? { span: layout || 6 }
    : {
        md: layout || 24,
        xs: 24
      }
}
// 返回按钮
const goBack = () => {
  $emit('back')
  if (route) {
    // vue-router
    route.back()
  } else {
    // 浏览器history API
    history.back()
  }
}

/**
 * 表单组件内部修改formData的方法,任何组件都通过这个方法来改变自身对应的formData的field的值
 * @param field
 * @param val
 */
const setField = (field, val) => {
  formData.value[field] = val
}
/**
 * 重置表单
 */
const resetForm = () => {
  formRef.value.resetFields()
  // 调用内部方法进行值的重置
  formRef.value.fields.forEach((field) => {
    formData.value[field.prop] = field.initialValue
  })
  $emit('reset') //重置一些在父组件需要重置的操作，一般用不上
}
const handleSubmitForm = async () => {
  try {
    // ele-form组件调用的父页面中定义的校验函数：校验规则通过的话再继续执行提交
    //$emit('before-validate', formData.value)
    if (props.beforeValidate) {
      const isPass = await props.beforeValidate(formData.value)
      if (isPass === false) return
    }

    await validate()
    // 为了不影响原值, 这里进行 clone
    let data = cloneDeep(formData.value)
    // valueFormatter的处理：未实现
    for (const field in data) {
      const formItem = formDesc[field]
      if (formItem && formItem.valueFormatter) {
        data[field] = formItem.valueFormatter(data[field], data)
      }
    }

    //$emit('before-request', data)
    if (props.beforeRequest) {
      const beforeRequestData = props.beforeRequest(data)
      if (beforeRequestData === false) return
      if (typeof beforeRequestData === 'object') {
        data = beforeRequestData
      }
    }

    if (props.requestFn) {
      // 在内部请求：成功或者失败的处理逻辑需要传入下述相关回调函数名接收数据即可
      if (innerIsLoading.value) return //已经在接口调用中的话避免再次发起请求
      innerIsLoading.value = true
      try {
        const response = await props.requestFn(data)
        $emit('request-success', response)
        if (props.requestSuccess) {
          props.requestSuccess(response)
        }
      } catch (error) {
        if (props.requestError) {
          props.requestError(error)
        }

        console.error(error)
        // 处理异常情况
        if (error instanceof Error) {
          // 返回的是Error类型, 则进行解析
          try {
            const msg = JSON.parse(error.message)
            if (msg instanceof Object) {
              innerFormError.value = msg
            }
            // eslint-disable-next-line
          } catch {}
        } else if (error instanceof Object) {
          // 返回的是对象类型, 则直接设置
          innerFormError.value = error
        }
        $emit('request-error')
      } finally {
        innerIsLoading.value = false
        if (props.requestEnd) {
          props.requestEnd()
        }
        $emit('request-end')
      }
    } else {
      // 在外部请求:成功或者失败的处理逻辑在外部request方法后续自定义
      if (props.isLoading) return
      $emit('request', data)
    }
  } catch (error) {
    // return this.processError(error)
    return error
  }
}
const validate = async () => {
  await validateForm()
  await this.validateComponent()
}
const validateForm = () => {
  return new Promise((resolve, reject) => {
    if (props.rules) {
      // 当传递了验证规则
      formRef.value.validate((valid, invalidFields) => {
        if (valid) {
          // 验证通过
          resolve(true)
        } else {
          // 显示错误
          reject(invalidFields)
        }
      })
    } else {
      resolve(true)
    }
  })
}
/**
 * 验证所有组件的内置验证方法
 */
const validateComponent = () => {
  const validators = formRef.value.fields.map((fields) => fields.validate).filter(Boolean)

  return Promise.all(validators.map((fn) => fn()))
}
const handleWindowResize = () => {
  if (!$refs.wrapper) return
  let { clientWidth } = $refs.wrapper
  if (clientWidth === 0 && $refs.wrapper instanceof Element) {
    // 隐藏的节点, 宽度为0
    // clientWidth = getSize($refs.wrapper).width
    clientWidth = $refs.wrapper.offsetWidth
  }

  parentElWidth.value = clientWidth
}
onMounted(() => {
  if (computedIsResponsive.value) {
    handleWindowResize()
  }
})
</script>

<style lang="scss">
.collapse-btn {
  transition: height 0.3s ease-in-out;
  overflow: hidden;
}
.flex-wrap {
  display: flex;
  flex-wrap: wrap;
}

.form-item-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 12px;
}

.ele-form {
  .el-form-item {
    width: 100%;
  }
  .ele-form-btns {
    .el-form-item__content {
      text-align: right;
      display: block;
    }
  }
  .el-form-item__content {
    height: auto;
    //min-height: 42px;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
    word-break: break-all;
  }
  .el-form-item__error {
    position: unset;
    padding-top: 2px;
  }
}

.ele-form--inline .ele-form-btns {
  // width: auto;
  text-align: right;
}

.ele-form-col--break {
  clear: both;
}

.ele-form-tip {
  color: #909399;
  line-height: 1.5em;
  margin-top: 3px;
}

.ele-form-tip code {
  padding: 2px 4px;
  font-size: 90%;
  color: #c7254e;
  background-color: #f9f2f4;
  border-radius: 4px;
}

.ele-form-full-line.el-date-editor.el-input,
.ele-form-full-line.el-date-editor .el-input__inner,
.ele-form-full-line.el-date-editor--daterange.el-input__inner,
.ele-form-full-line.el-date-editor--datetimerange.el-input__inner,
.ele-form-full-line.el-date-editor--timerange.el-input__inner,
.ele-form-full-line.el-date-editor--monthrange.el-input__inner,
.ele-form-full-line.el-cascader,
.ele-form-full-line.el-select,
.ele-form-full-line.el-autocomplete {
  width: 100% !important;
}
</style>
