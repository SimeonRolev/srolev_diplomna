import { markHighlightColor } from './utils/variables';

const scannerStyles = `
    #scanner-root {
        position: fixed;
        top: 5px;
        right: 5px;
        max-width: 300px;
        z-index: 999999;
    }
    
    .mark-highlight--page {
        background-color: ${markHighlightColor}
    }
    
    .mark-highlight--note {
        background-color: transparent;
        font-weight: bold;
    }
`

document.head.appendChild(
    document.createElement('style')
).textContent = scannerStyles;
