import { useEffect } from 'react';

export default function AdsterraBanner() {
  useEffect(() => {
    // This script needs to be re-run or ensured to run after the container is in the DOM
    const script = document.createElement('script');
    script.src = 'https://pl29421612.profitablecpmratenetwork.com/f2f6be00edaec33bab99ab03921201fc/invoke.js';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    
    const container = document.getElementById('container-f2f6be00edaec33bab99ab03921201fc');
    if (container) {
      container.appendChild(script);
    }

    return () => {
      // Clean up if necessary, though many ad scripts don't support easy cleanup
      if (container && script.parentNode === container) {
        container.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full flex justify-center py-8">
      <div id="container-f2f6be00edaec33bab99ab03921201fc"></div>
    </div>
  );
}
