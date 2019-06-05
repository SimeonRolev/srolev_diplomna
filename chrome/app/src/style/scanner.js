const scannerStyles = `
    #scanner-root {
        position: fixed;
        top: 5px;
        right: 5px;
        max-width: 250px;
        z-index: 999999;
    }    
`

document.head.appendChild(
    document.createElement('style')
).textContent = scannerStyles;
