import { shallowMount } from '@vue/test-utils'
import App from '@/App.vue'

jest.mock("firebase/app", ()=> ({
    auth(){
        return {
            onAuthStateChanged(fnc){
                return fnc(true);
            },
        
        }
    }
}))

describe('App.vue', ()=> {
    let wrapper;
    beforeEach(()=> {
        wrapper = shallowMount(App, {

        })

        it("indlæser", ()=>{
            expect(wrapper.exsists()).toBe(true);
        })

        it("h1 findes", ()=>{
            expect(wrapper.find("h1").text()).toBe("Log ind")
        }) 

        it("brugeren er logged ind ", ()=>{
            expect(wrapper.vm.$data.login).toBe(true);
        })


    })
})