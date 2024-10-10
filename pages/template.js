import React, {useEffect} from "react";

function componentDidMount() {
    // Get index container
    const index = document.querySelector('.headers-overview-elements');

    // Find all headers
    const container = document.querySelector('.container-page');
    const headers = container.querySelectorAll('h2');
    for (const header of headers) {
        const listItem = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.textContent = header.innerText;
        anchor.setAttribute('href', '#' + header.id);
        anchor.setAttribute('class', 'headers-overview-element');
        listItem.appendChild(anchor);
        index.appendChild(listItem);
    }

    // Only show overview node if we have at least one header
    if (headers.length > 0) {
        index.parentNode.style.display = 'block';
    }

    // Show headers as active based on scroll status
    window.addEventListener('load', updateIndex);
    window.addEventListener('scroll', updateIndex);
    function updateIndex(){
        // Unselect all other entries
        const entries = document.querySelectorAll('a.headers-overview-element');
        for (let i = 0; i < entries.length; i++) {
            entries[i].classList.remove('headers-overview-element-active');
        }

        // Select the hovered entry
        const header = getActiveHeader();
        if (header) {
            let match = index.querySelector('a[href="#' + header.id + '"]');
            if (match) {
                match.classList.add('headers-overview-element-active');
            }
        }
    }
    // Get the first header section that is visible
    function getActiveHeader() {
        let lastHiddenHeader;
        for (const header of headers) {
            if (header.id) {
                if (header.getBoundingClientRect().top <= 70) { // Offset to account for fixed header
                    lastHiddenHeader = header;
                } else {
                    return lastHiddenHeader;
                }
            }
        }
        return lastHiddenHeader;
    }
}

export default function Template({ children }) {
    useEffect(() => {
        componentDidMount();
    }, []);
    return (
        <div className="container-page">
            {children}
        </div>
    )
}