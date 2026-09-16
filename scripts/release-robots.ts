import {productionOrigin} from './release-origin';

export const releaseRobotsText=`User-agent: *\nAllow: /\nSitemap: ${productionOrigin}/sitemap.xml\n`;
/** Readers pass full content or a 2048-byte prefix; exact equality rejects appended text. */
export function isReleaseRobots(file:{file:string;prefix:string;content?:string}):boolean {
  return file.file==='robots.txt'&&(file.content??file.prefix)===releaseRobotsText;
}
