import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import defaultLogo from './assets/cldy.svg';

function App() {
    const [config, setConfig] = useState(null);
    const sectionsRef = useRef([]);

    useEffect(() => {
        fetch('/config.json')
            .then(response => response.json())
            .then(data => {
                setConfig(data);
                // Set CSS variables for theme colors
                document.documentElement.style.setProperty('--primary-color', data.theme.primaryColor);
                document.documentElement.style.setProperty('--secondary-color', data.theme.secondaryColor);
            })
            .catch(error => console.error('Error fetching the config:', error));
    }, []);

    useEffect(() => {
        const handleScroll = (event) => {
            const currentSectionIndex = sectionsRef.current.findIndex(section => {
                const rect = section.getBoundingClientRect();
                return rect.top >= 0 && rect.top < window.innerHeight;
            });
            if (event.deltaY > 0) {
                // Scrolling down
                scrollToSection(currentSectionIndex + 1);
            } else {
                // Scrolling up
                scrollToSection(currentSectionIndex - 1);
            }
        };

        window.addEventListener('wheel', handleScroll);

        return () => {
            window.removeEventListener('wheel', handleScroll);
        };
    }, []);

    const scrollToSection = (index) => {
        if (index >= 0 && index < sectionsRef.current.length) {
            sectionsRef.current[index].scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (!config) {
        return <div>Loading...</div>;
    }

    const { title, apps, theme } = config;

    return (
        <div className="app">
            <div style={{ backgroundColor: theme.background, color: theme.secondaryColor }} className="container full-page" ref={el => sectionsRef.current[0] = el} id="section1">
                <header className="header" style={{ backgroundColor: theme.primaryColor }}>
                    <div className="header-content">
                        <h1>{title}</h1>
                        <nav className="nav-tabs">
                            <a href="#section1">Home</a>
                            <a href="#section2">Section 1</a>
                            <a href="#section3">Section 2</a>
                            <a href="#section4">Section 3</a>
                        </nav>
                    </div>
                </header>
                <main className="app-grid">
                    {apps.map((app, index) => (
                        <a key={index} href={app.url} target="_blank" rel="noopener noreferrer" className="app-link">
                            <img
                                src={app.logo}
                                alt={`${app.name} logo`}
                                className="app-logo"
                                onError={(e) => { e.target.src = defaultLogo; }}
                            />
                            <h2>{app.name}</h2>
                        </a>
                    ))}
                </main>
                <button className="scroll-button" onClick={() => scrollToSection(1)}>
                    Scroll to Next Section
                </button>
            </div>
            <div id="section2" className="scroll-section full-page" ref={el => sectionsRef.current[1] = el}>
                <h2>Additional Information 1</h2>
                <p>This is the additional section that users can scroll to.</p>
                <button className="scroll-button" onClick={() => scrollToSection(2)}>
                    Scroll to Next Section
                </button>
            </div>
            <div id="section3" className="scroll-section full-page" ref={el => sectionsRef.current[2] = el}>
                <h2>Additional Information 2</h2>
                <p>This is another additional section.</p>
                <button className="scroll-button" onClick={() => scrollToSection(3)}>
                    Scroll to Next Section
                </button>
            </div>
            <div id="section4" className="scroll-section full-page" ref={el => sectionsRef.current[3] = el}>
                <h2>Additional Information 3</h2>
                <p>This is the final additional section.</p>
                <button className="scroll-button" onClick={() => scrollToSection(0)}>
                    Back to Top
                </button>
            </div>
        </div>
    );
}

export default App;
