import React from 'react'
import Scanner, {ScannerMatches} from '../components/ScannerMatches';
import { configure, shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

const dummyOccurrences = {
    'reverse': [
        { onclick: function () { return 'first' }},
        { onclick: function () { return 'second' }}
    ],
    'falling': [
        { onclick: function () { return 'first' }},
        { onclick: function () { return 'second' }}
    ]
}

describe('<Scanner /> UI tests', () => {
   it('Renders interface', () => {
        const wrapper = mount(<Scanner matches={dummyOccurrences} />)

        // Translation field
        const selectedWord = wrapper.find('#detected-occurs').find('input')
        expect(selectedWord.exists())
        expect(selectedWord.props().value).toBe('reverse')

        expect(wrapper.find('NavigateBefore').exists())
        expect(wrapper.find('NavigateNext').exists())
        expect(wrapper.find('WordPreviewer').exists())

        wrapper.unmount();
    })
})


describe('<Wrapper /> unit tests', () => {
    it('Empty matches does not render component', () => {
        const wrapper = mount(<Scanner />)
        expect(wrapper.isEmptyRender())
        wrapper.unmount()
    })
})

describe('<Scanner /> unit tests', () => {

    it('Navigates correctly', () => {
        const wrapper = mount(<ScannerMatches
            matches={dummyOccurrences}
            word='reverse'
            occurrenceIndex={0}
            unmountSelf={(function () {})}
        />)
        
        expect(wrapper.instance().getMatchIndex('reverse')).toBe(0)
        
        // Test next
        const nextButton = wrapper.find('#navigate-next').first()
        nextButton.simulate('click')
        expect(wrapper.instance().getMatchIndex('reverse')).toBe(1)
        nextButton.simulate('click')
        expect(wrapper.instance().getMatchIndex('reverse')).toBe(1)
        expect(wrapper.instance().getClickEvent('reverse')()).toBe('second')
        
        // Test prev
        const prevButton = wrapper.find('#navigate-prev').first()
        prevButton.simulate('click')
        expect(wrapper.instance().getMatchIndex('reverse')).toBe(0)
        prevButton.simulate('click')
        expect(wrapper.instance().getMatchIndex('reverse')).toBe(0)
        expect(wrapper.instance().getClickEvent('reverse')()).toBe('first')
        

        const wordPreviewer = wrapper.find('WordPreviewer')
        expect(wordPreviewer.instance().props['word']).toBe(wrapper.instance().state.word)

        wrapper.unmount();
    })
})