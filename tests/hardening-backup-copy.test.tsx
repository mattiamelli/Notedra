// @vitest-environment jsdom
import {renderToStaticMarkup} from 'react-dom/server';
import {expect,it} from 'vitest';
import {StudentDataPanel} from '../src/learning/StudentDataPanel';
it('backup guidance does not falsely deny optional cloud sync or claim to replace other profiles',()=>{
 const html=renderToStaticMarkup(<StudentDataPanel/>);
 expect(html).not.toContain('It is not cloud-synced');
 expect(html).toContain('current local profile');
 expect(html).toContain('Account');
});
