"use client";

import { useEffect, useRef, useState } from 'react';

const Cursor = () => {
    // Refs for mutable state without re-renders
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);

    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        // State for position and velocity
        let mouseX = 0;
        let mouseY = 0;

        let followerX = 0;
        let followerY = 0;

        const onMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Direct update for the main cursor (instant)
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
            }
        };

        const onMouseDown = () => {
            if (followerRef.current) {
                followerRef.current.classList.add('scale-75');
            }
        };

        const onMouseUp = () => {
            if (followerRef.current) {
                followerRef.current.classList.remove('scale-75');
            }
        };

        const onMouseEnter = () => setHovered(true);
        const onMouseLeave = () => setHovered(false);

        // Animation loop for the trailer (smooth lag)
        const animate = () => {
            // Linear interpolation (Lerp) for smooth following
            // adjust 0.1 for speed (lower = slower/laggier)
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;

            if (followerRef.current) {
                followerRef.current.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) scale(${hovered ? 2.5 : 1})`;
            }

            requestAnimationFrame(animate);
        };

        // Event Listeners for links to trigger hover state
        const handleLinkHoverEvents = () => {
            const handleLinkEnter = () => setHovered(true);
            const handleLinkLeave = () => setHovered(false);

            document.querySelectorAll("a, button, .cursor-pointer, input, select, textarea").forEach((el) => {
                el.addEventListener("mouseenter", handleLinkEnter);
                el.addEventListener("mouseleave", handleLinkLeave);
            });
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);

        // Start animation loop
        const animId = requestAnimationFrame(animate);

        // Initial attach
        handleLinkHoverEvents();

        // Observer for dynamic content
        const observer = new MutationObserver(handleLinkHoverEvents);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mouseup', onMouseUp);
            cancelAnimationFrame(animId);
            observer.disconnect();
        };
    }, [hovered]);

    return (
        <>
            <style jsx global>{`
                body, a, button, input, select, textarea {
                    cursor: none !important;
                }
            `}</style>

            {/* Main Dot Cursor */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-2 h-2 bg-black rounded-full pointer-events-none z-[9999] mix-blend-difference"
                style={{ marginTop: '-4px', marginLeft: '-4px' }} // Center alignment fix
            />

            {/* Trailing Circle */}
            <div
                ref={followerRef}
                className={`fixed top-0 left-0 w-10 h-10 border border-black rounded-full pointer-events-none z-[9998] transition-opacity duration-300 ease-out mix-blend-difference
                    ${hovered ? 'bg-white border-transparent opacity-50' : 'opacity-100'}
                `}
                style={{ marginTop: '-20px', marginLeft: '-20px', willChange: 'transform' }} // Center alignment fix
            />
        </>
    );
};

export default Cursor;
