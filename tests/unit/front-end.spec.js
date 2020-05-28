import { mount } from '@vue/test-utils'
import App from '@/App.vue'




describe('App', () => {

    const wrapper = mount(App)

    it('renders correct title', () => {
        expect(wrapper.html()).toContain('<h1>Log ind</h1>')
    })

    it('has a button', () => {
        expect(wrapper.contains('button')).toBe(true)
    })
})

   
  
