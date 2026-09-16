import {Component, type ReactNode} from 'react';
import {Link} from 'react-router';
/** Keep a failed page inside the current account and leave navigation available. */
export class RouteBoundary extends Component<{children:ReactNode;resetKey:string},{failed:boolean;resetKey:string}> {
  state={failed:false,resetKey:this.props.resetKey};
  static getDerivedStateFromProps(props:{resetKey:string},state:{resetKey:string}){return props.resetKey!==state.resetKey?{failed:false,resetKey:props.resetKey}:null;}
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?<section className="ds-section" role="alert"><h1>This page could not be loaded</h1><p>Your saved data has not been reset. Check your connection, then reload to try again. You can also open another page from the navigation.</p><div className="ds-account-actions"><button className="ds-button" onClick={()=>window.location.reload()}>Reload page</button><Link className="ds-button" to="/dashboard">Go to Dashboard</Link></div></section>:this.props.children;}
}
