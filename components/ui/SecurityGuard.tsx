'use client';

import { useEffect } from 'react';

export function SecurityGuard() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Completely disable console methods to prevent API/Embed URL leaks
    const noop = () => {};
    const methods = [
      'log', 'debug', 'info', 'warn', 'error', 'table', 'trace', 'dir', 
      'dirxml', 'group', 'groupCollapsed', 'groupEnd', 'clear', 'count', 
      'countReset', 'assert', 'profile', 'profileEnd', 'time', 'timeLog', 
      'timeEnd', 'timeStamp', 'context', 'memory'
    ];
    
    methods.forEach((method) => {
      // @ts-ignore
      window.console[method] = noop;
    });

    // Prevent any third-party scripts from restoring it easily
    Object.freeze(window.console);

    // 2. Block Right-Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);

    // 3. Block DevTools Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12
      if (e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
      }
      
      // Prevent Ctrl+Shift+I / J / C (Windows/Linux)
      if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      // Prevent Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      // Prevent Cmd+Option+I / J / C / U (Mac)
      if (e.metaKey && e.altKey && ['I', 'J', 'C', 'U', 'i', 'j', 'c', 'u'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener('keydown', handleKeyDown, { capture: true });

    // 4. Advanced Debugger Trap
    // Using a recursive setTimeout is harder to defeat with a simple `clearInterval` brute force.
    let isTrapActive = true;
    const triggerTrap = () => {
      if (!isTrapActive) return;
      (function() { return false; })['constructor']('debugger')();
      setTimeout(triggerTrap, 50);
    };
    triggerTrap();

    // 5. Anti-Tampering for DOM insertion (blocks bookmarklets from appending scripts)
    const originalAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function<T extends Node>(node: T): T {
      if (node instanceof HTMLScriptElement) {
        // Block any third-party script tags from being injected dynamically
        if (!node.src.includes(window.location.origin) && !node.src.includes('vercel-scripts')) {
          console.error('SecurityGuard: Blocked script injection attempt.');
          return node; // Return without appending
        }
      }
      return originalAppendChild.call(this, node) as T;
    };

    return () => {
      isTrapActive = false;
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
      Element.prototype.appendChild = originalAppendChild;
    };
  }, []);

  return null;
}
