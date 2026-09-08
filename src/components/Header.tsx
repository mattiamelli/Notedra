import { Icon } from './Icon';
export function Header() {
  return <header className="app-header">
    <div className="brand"><span className="brand-mark"><Icon name="code" size={23}/></span><span>Delft<span className="font-normal">Study</span></span><span className="brand-divider"/><span className="brand-product">Assembly Visualizer</span><span className="version-badge">MVP</span></div>
    <div className="header-context"><span>COMPUTER ORGANIZATION</span><span className="local-indicator"><i/> Runs locally in your browser</span></div>
  </header>;
}
