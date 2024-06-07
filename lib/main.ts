import { VueInstance } from 'vue'
import ShowComponent from './components/ShowComponent.vue'
import FormComponent from './ele-form.vue'

const nameToComponents = {
  'show-form': ShowComponent,
  'ele-form': FormComponent
}
const eleformComponent = {}
eleformComponent.install = (app: VueInstance) => {
  for (const name in nameToComponents) {
    app.component(name, nameToComponents[name])
  }
}

export default eleformComponent
