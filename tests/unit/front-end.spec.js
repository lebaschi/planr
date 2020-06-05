import { mount } from '@vue/test-utils'
import App from '@/App.vue'




describe('App', () => {

   const wrapper = mount(App)

    it('indlæser titlen korrekt', () => {
        expect(wrapper.html()).toContain('<h1>Log ind</h1>')
    })

    it('har en knap', () => {
        expect(wrapper.contains('button')).toBe(true)
    })
})

   
  
