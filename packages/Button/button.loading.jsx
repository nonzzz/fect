import { defineComponent } from 'vue'

import Loading from '../Loading'

import './button.loading.less'

const ButtonLoading = defineComponent({
  setup(props, { attrs }) {
    return () => (
      <div className={`fay-btn-loading ${attrs.color}`}>
        <Loading />
      </div>
    )
  },
})

export default ButtonLoading
