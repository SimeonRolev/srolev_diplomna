import React from 'react'
import WordPreviewer from '../components/WordPreviewer';
import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

describe('<WordPreviewer /> UI tests', () => {
   it('Renders interface', () => {
        const wrapper = mount(<WordPreviewer word='reverse' />)
        wrapper.setState({context: 'Example context'})

        // Translation field
        const translationField = wrapper.find('#translation-field > textarea').first()
        expect(translationField.exists()).toBe(true)
        expect(translationField.text()).toBe('Translation of word reverse')

        // Translations list
        expect(wrapper.find('ContextItem').length).toBeGreaterThan(0)
        
        // Context field
        const contextField = wrapper.find('#context-field > textarea').first()
        expect(contextField.exists()).toBe(true)
        expect(contextField.text()).toBe('Example context')

        wrapper.unmount();
    })
})
