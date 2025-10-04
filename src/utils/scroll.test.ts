/**
 * Tests for scroll utility functions
 * Core functionality for WiCGATE's pixel-perfect navigation system
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getNavHeight, getHeaderHeightWithBuffer, scrollToSection } from './scroll';
import { MOBILE_BREAKPOINT } from '../constants';

describe('scroll utilities', () => {
  beforeEach(() => {
    // Reset DOM for each test
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  describe('getNavHeight', () => {
    it('should return fallback value when header element not found', () => {
      const height = getNavHeight();
      expect(height).toBe(80);
    });

    it('should return exact nav height without buffer', () => {
      // Create mock header
      const header = document.createElement('header');
      document.body.appendChild(header);

      // Mock getBoundingClientRect
      vi.spyOn(header, 'getBoundingClientRect').mockReturnValue({
        height: 75.4, // Test rounding
        width: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

      const height = getNavHeight();
      // Should round up to 76, no buffer
      expect(height).toBe(76);
    });
  });

  describe('getHeaderHeightWithBuffer', () => {
    it('should calculate header height with desktop buffer', () => {
      // Mock desktop screen width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      // Create mock header
      const header = document.createElement('header');
      document.body.appendChild(header);

      // Mock getBoundingClientRect
      vi.spyOn(header, 'getBoundingClientRect').mockReturnValue({
        height: 75,
        width: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

      const height = getHeaderHeightWithBuffer();

      // Expected: 75 (nav) + 5 (desktop buffer) = 80
      expect(height).toBe(80);
    });

    it('should calculate header height with mobile buffer', () => {
      // Mock mobile screen width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      // Create mock header
      const header = document.createElement('header');
      document.body.appendChild(header);

      // Mock getBoundingClientRect
      vi.spyOn(header, 'getBoundingClientRect').mockReturnValue({
        height: 70,
        width: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

      const height = getHeaderHeightWithBuffer();

      // Expected: 70 (nav) + 10 (mobile buffer) = 80
      expect(height).toBe(80);
    });
  });

  describe('constants', () => {
    it('should use correct mobile breakpoint', () => {
      expect(MOBILE_BREAKPOINT).toBe(768);
    });
  });

  describe('rounding behavior', () => {
    it('should ceil the result to avoid sub-pixel issues', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      const header = document.createElement('header');
      document.body.appendChild(header);

      // Mock fractional height
      vi.spyOn(header, 'getBoundingClientRect').mockReturnValue({
        height: 75.7, // Fractional height
        width: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

      const height = getHeaderHeightWithBuffer();

      // Expected: ceil(75.7) + 5 = 76 + 5 = 81
      expect(height).toBe(81);
    });
  });

  describe('scrollToSection', () => {
    let scrollToSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      // Mock window.scrollTo
      scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
      Object.defineProperty(window, 'scrollY', { writable: true, value: 0 });
    });

    it('should scroll to top for hero section', () => {
      scrollToSection('hero');

      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });

    it('should support auto scroll behavior', () => {
      scrollToSection('hero', 'auto');

      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 0,
        behavior: 'auto',
      });
    });

    it('should warn when section not found', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      scrollToSection('nonexistent');

      expect(consoleWarnSpy).toHaveBeenCalledWith('[scroll] Section not found: nonexistent');
      expect(scrollToSpy).not.toHaveBeenCalled();
    });

    it('should calculate correct scroll position with header offset', () => {
      // Create header
      const header = document.createElement('header');
      document.body.appendChild(header);

      vi.spyOn(header, 'getBoundingClientRect').mockReturnValue({
        height: 80,
        width: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

      // Create section at position 500px
      const section = document.createElement('section');
      section.id = 'statistics';
      document.body.appendChild(section);

      vi.spyOn(section, 'getBoundingClientRect').mockReturnValue({
        top: 100, // 100px from current viewport top
        height: 400,
        width: 0,
        bottom: 0,
        left: 0,
        right: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

      // Mock scrollY at 400
      Object.defineProperty(window, 'scrollY', { writable: true, value: 400 });

      // Mock desktop width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: 1200,
      });

      scrollToSection('statistics');

      // Section absolute top = 100 (relative to viewport) + 400 (current scroll) = 500
      // Header height = 80 (nav only, buffer not included in scroll target)
      // Target Y = 500 - 80 = 420
      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 420,
        behavior: 'smooth',
      });
    });

    it('should never scroll to negative position', () => {
      // Create header
      const header = document.createElement('header');
      document.body.appendChild(header);

      vi.spyOn(header, 'getBoundingClientRect').mockReturnValue({
        height: 150, // Very tall header
        width: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

      // Create section near top
      const section = document.createElement('section');
      section.id = 'getting-started';
      document.body.appendChild(section);

      vi.spyOn(section, 'getBoundingClientRect').mockReturnValue({
        top: 50,
        height: 400,
        width: 0,
        bottom: 0,
        left: 0,
        right: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

      Object.defineProperty(window, 'scrollY', { writable: true, value: 0 });
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 1200 });

      scrollToSection('getting-started');

      // Would calculate negative, but should be clamped to 0
      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });
  });
});
