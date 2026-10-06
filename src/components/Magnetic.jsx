import React from 'react';

/**
 * Magnetic Component Wrapper
 * 
 * Wraps any interactive element (buttons, links, badges, icons) to grant it
 * magnetic attraction. It registers `data-magnetic="true"` on the container
 * and shifts an inner `[data-magnetic-pull]` wrapper toward the pointer,
 * preventing any collisions with Framer Motion or child hover transforms.
 *
 * @param {React.ReactNode} children - Child element to make magnetic
 * @param {string} [className] - Optional custom CSS classes
 * @param {React.CSSProperties} [style] - Optional inline styles
 * @param {React.ElementType} [as='span'] - Wrapper element tag (defaults to 'span' for inline element safety)
 * @param {boolean} [disabled=false] - Whether magnetic pull is disabled
 */
export default function Magnetic({
  children,
  className = '',
  style = {},
  as: Component = 'span',
  disabled = false,
  ...props
}) {
  if (disabled) {
    return (
      <Component className={className} style={style} {...props}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      data-magnetic="true"
      className={`magnetic-wrapper inline-block ${className}`}
      style={{
        display: 'inline-block',
        ...style,
      }}
      {...props}
    >
      <span
        data-magnetic-pull="true"
        className="magnetic-pull inline-block w-full h-full"
        style={{
          display: 'inline-block',
          willChange: 'transform',
        }}
      >
        {children}
      </span>
    </Component>
  );
}
