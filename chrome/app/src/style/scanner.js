import { markHighlightColorLight, markHighlightColorHeavy } from './utils/variables';

const scannerStyles = `
    #scanner-root {
        position: fixed;
        top: 5px;
        right: 5px;
        width: 500px;
        z-index: 1000;
    }

    #scanner-matches-root {
        position: fixed;
        top: 5px;
        right: 5px;
        width: 250px;
        z-index: 999999;
    }
    
    .mark-highlight--page.light {
        background-color: ${markHighlightColorLight}
    }
    
    .mark-highlight--page.heavy {
        background-color: ${markHighlightColorHeavy}
    }
    
    .mark-highlight--note {
        background-color: transparent;
        font-weight: bold;
    }
`

document.head.appendChild(
    document.createElement('style')
).textContent = scannerStyles;
