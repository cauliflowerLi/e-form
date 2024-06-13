import { VueInstance } from 'vue'
import EleFormInput from './components/Ele-Form-Input.vue'
import EleFormShow from './components/Ele-Form-Show.vue'
import FormComponent from './Ele-Form.vue'

const nameToComponents = {
  FormComponent,
  EleFormShow,
  EleFormInput
}
interface eleform {
  install: (app: VueInstance) => void
}
const eleformComponent: eleform = {
  install: (app: VueInstance): void => {
    Object.values(nameToComponents).forEach((component) => {
      const name = component.__name && component.__name.toLowerCase()
      name && app.component(name, component)
    })
  }
}

export default eleformComponent
