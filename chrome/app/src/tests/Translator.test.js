import React from 'react'
import Translator from '../components/Translator';
import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

describe('<Translator /> UI tests', () => {
   it('Renders interface', () => {
        const wrapper = mount(<Translator />)
        wrapper.setState({
            from: 'eng',
            to: 'bul',
            notes: 'Example context'
        })
        return wrapper.instance().onGetSelection({ word: 'reverse' }).then(() => {
            const translations = wrapper.instance().state.translations.items

            wrapper.update()
            
            expect(wrapper.find('.from-to-btns').exists()).toBe(true)

            // Translation field
            const translationField = wrapper.find('#translation-field > textarea').first()
            expect(translationField.exists()).toBe(true)
            expect(translationField.text()).toBe(translations[0].item.result)

            // Translations list
            expect(wrapper.find('TranslationItem').length).toBeGreaterThan(0)
            
            // Context field
            const contextField = wrapper.find('#context-field > textarea').first()
            expect(contextField.exists()).toBe(true)
            expect(contextField.text()).toBe('Example context')

            wrapper.unmount();
        })
    })
})


describe('<Translator /> unit tests', () => {

    it('Throws on empty selection', () => {
        const wrapper = mount(<Translator />)
        wrapper.setState({
            from: 'eng',
            to: 'bul'
         })
 
        expect(() => {
            wrapper.instance().onGetSelection({ word: null })
        }).toThrow()
        wrapper.unmount()
    })

    it('Translates and populates', () => {
        const wrapper = mount(<Translator />)
        wrapper.setState({
            from: 'eng',
            to: 'bul'
         })
 
        return wrapper.instance().onGetSelection({ word: 'reverse' }).then(() => {
            const translations = wrapper.instance().state.translations.items

            // Loaded correctly
            expect(translations.length).toBeGreaterThan(0)

            // The first translation gets selected
            expect(translations[0].selected).toBe(true)

            // The selected translation populates the translation field
            const firstTranslationText = translations[0].item.result;
            const secondTranslationText = translations[1].item.result;
            expect(wrapper.instance().state.translation).toBe(firstTranslationText);

            // Clicking on a selection loads it in the field for tranlation
            wrapper.instance().selectTranslation(translations[1].item.name)
            expect(wrapper.instance().state.translation).toBe(secondTranslationText);

            // Saves word
            expect(wrapper.instance().save()).toBe('saveWord')
            
            wrapper.unmount()
        })
    })
})