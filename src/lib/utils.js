// src/lib/utils.js

/**
 * Combines multiple class names, useful for conditional classes
 * A simplified version that doesn't require additional dependencies
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
  }