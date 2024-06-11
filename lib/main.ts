import EleFormInput from './components/EleFormInput.vue'
import EleFormShow from './components/ShowComponent.vue'
import FormComponent from './ele-form.vue'

const nameToComponents = {
  EleFormShow,
  EleFormInput,
  FormComponent
}
interface eleform {
  install: (app) => void
}
const eleformComponent: eleform = {
  install: (app): void => {
    Object.values(nameToComponents).forEach((component) => {
      app.component(component.name, component)
    })
  }
}

export default eleformComponent
