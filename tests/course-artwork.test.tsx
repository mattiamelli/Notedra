// @vitest-environment jsdom
import {readFileSync, statSync} from 'node:fs';
import {renderToStaticMarkup} from 'react-dom/server';
import {expect, it} from 'vitest';
import {courses} from '../src/academic/navigation';
import {CourseArtwork} from '../src/shell/CourseArtwork';

it('gives each added course a distinct local, valid and lightweight decorative image', () => {
  const paths = new Set<string>();
  let totalBytes = 0;
  for (const course of courses.filter(course => course.trimester !== 1)) {
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(<CourseArtwork course={course} />);
    const image = container.querySelector('img')!;
    expect(image).not.toBeNull();
    expect(image.getAttribute('alt')).toBe('');
    expect(image.getAttribute('loading')).toBe('lazy');
    expect(image.getAttribute('decoding')).toBe('async');
    expect(image.getAttribute('width')).toBe('768');
    expect(image.getAttribute('height')).toBe('256');
    expect(image.parentElement?.getAttribute('aria-hidden')).toBe('true');
    const src = image.getAttribute('src')!;
    expect(src).toMatch(/^\/course-artwork\/[a-z-]+\.png$/);
    expect(container.querySelector('.ds-course-tag')?.textContent).toBe(course.code);
    paths.add(src);
    const file = readFileSync(`public${src}`);
    expect(file.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
    expect(file.readUInt32BE(16)).toBe(768);
    expect(file.readUInt32BE(20)).toBeGreaterThanOrEqual(256);
    totalBytes += statSync(`public${src}`).size;
  }
  expect(paths.size).toBe(8);
  expect(totalBytes).toBeLessThan(800_000);
});

it('preserves the original three vector course headers', () => {
  for (const course of courses.filter(course => course.trimester === 1)) {
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(<CourseArtwork course={course} />);
    expect(container.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 320 112');
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('.ds-course-tag')?.textContent).toBe(course.compactName);
  }
});
