"use client";

import React, { useState, useEffect, useRef } from "react";

// This functional component represents a custom cursor with a flare effect and inner dot.
function FlareCursor() {
  // State to track the current cursor position (x, y coordinates).
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // State to track the previous cursor position for calculating movement.
  const [prevPosition, setPrevPosition] = useState({ x: 0, y: 0 });
  
  // State to track whether the cursor is over a clickable element.
  const [isPointer, setIsPointer] = useState(false);
  
  // State to track if the cursor is visible.
  const [isVisible, setIsVisible] = useState(false);
  
  // State to track if mouse is moving.
  const [isMoving, setIsMoving] = useState(false);
  
  // Ref for the inner dot element.
  const innerDotRef = useRef(null);

  // Event handler for the mousemove event.
  const handleMouseMove = (e) => {
    // Update the previous position before setting new position.
    setPrevPosition(position);
    
    // Update the cursor position based on the mouse coordinates.
    const newPosition = { x: e.clientX, y: e.clientY };
    setPosition(newPosition);

    // Show cursor if it's not visible yet.
    if (!isVisible) {
      setIsVisible(true);
    }

    // Set moving state to true
    setIsMoving(true);

    // Clear the moving state after a short delay
    clearTimeout(window.mouseMoveTimeout);
    window.mouseMoveTimeout = setTimeout(() => {
      setIsMoving(false);
    }, 100);

    // Get the target element that the cursor is currently over.
    const target = e.target;

    // Check if the cursor is over a clickable element by inspecting the cursor style.
    setIsPointer(
      window.getComputedStyle(target).getPropertyValue("cursor") === "pointer"
    );
  };

  // Event handler for mouse enter.
  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  // Event handler for mouse leave.
  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  // Calculate the inner dot position based on movement direction.
  const calculateInnerDotPosition = () => {
    // If not moving or no previous position, return to center
    if (!isMoving || (!prevPosition.x && !prevPosition.y)) return { x: 0, y: 0 };
    
    const deltaX = position.x - prevPosition.x;
    const deltaY = position.y - prevPosition.y;
    
    // Calculate the distance moved.
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // If movement is very small or no movement, return to center
    if (distance < 3) return { x: 0, y: 0 };
    
    // Normalize the direction vector.
    const normalizedX = deltaX / distance;
    const normalizedY = deltaY / distance;
    
    // Allow more overflow for the dragging effect
    // Outer circle radius is 16px (32px diameter / 2), inner dot radius is 2px (4px diameter / 2)
    // Allow the dot to go further beyond the circle boundary for more dramatic dragging effect
    const maxSafeDistance = 22; // Increased to allow more overflow
    
    // Use a larger edge distance to allow more overflow when moving quickly
    const edgeDistance = Math.min(16, maxSafeDistance);
    
    return {
      x: normalizedX * edgeDistance,
      y: normalizedY * edgeDistance
    };
  };

  // Calculate the outer circle offset to follow the inner dot
  const calculateOuterCircleOffset = () => {
    const innerDotPos = calculateInnerDotPosition();
    // Move the outer circle in the same direction as the inner dot
    // This creates the effect that the inner dot is "dragging" the outer circle
    return {
      x: innerDotPos.x * 0.4, // 40% of the inner dot movement in same direction
      y: innerDotPos.y * 0.4
    };
  };

  // Set up an effect to add and remove the event listeners.
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [position, isVisible]); // Include dependencies.

    // Calculate the size of the outer circle based on whether the cursor is over a clickable element.
  const outerCircleSize = isPointer ? 0 : 32;
  
  // Calculate inner dot position and outer circle offset.
  const innerDotPosition = calculateInnerDotPosition();
  const outerCircleOffset = calculateOuterCircleOffset();

  // Adjust the cursor position to create a visual effect when over a clickable element.
  const cursorStyle = isPointer ? { left: "-100px", top: "-100px" } : {};

  // Render the custom cursor element with dynamic styles based on cursor state.
  return (
    <div
      className={`custom-cursor ${isPointer ? "pointer" : ""} ${isVisible ? "visible" : ""}`}
      style={{
        ...cursorStyle,
        left: `${position.x + outerCircleOffset.x}px`,
        top: `${position.y + outerCircleOffset.y}px`,
        width: `${outerCircleSize}px`,
        height: `${outerCircleSize}px`,
      }}
    >
             {/* Inner dot that moves to the edge */}
       <div
         ref={innerDotRef}
         className="inner-dot"
         style={{
           transform: `translate(calc(-50% + ${innerDotPosition.x}px), calc(-50% + ${innerDotPosition.y}px))`,
         }}
       ></div>
     </div>
   );
}

// Export the FlareCursor component to be used in other parts of the application.
export default FlareCursor;
