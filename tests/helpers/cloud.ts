import type {CloudRepository} from '../../src/cloud/coordinator';
import {same,SyncError,type CloudSnapshot,type LearnerPayload} from '../../src/cloud/model';
const A='11111111-1111-4111-8111-111111111111';
export class FakeCloud implements CloudRepository {
  snapshot: CloudSnapshot | null = null;
  receipts = new Map<string,{input:unknown;result:CloudSnapshot}>();
  puts=0; reads=0; failRead=false; failPut=false; loseAck=false;
  onPut: (()=>Promise<void>) | null = null;
  constructor(readonly owner=A) {}
  async read() {this.reads++; if(this.failRead)throw new SyncError('NETWORK','Download failed'); return structuredClone(this.snapshot);}
  async put(input:{expectedRevision:number;operationId:string;payload:LearnerPayload}) {
    this.puts++; if(this.onPut)await this.onPut(); if(this.failPut)throw new SyncError('NETWORK','Upload failed');
    const old=this.receipts.get(input.operationId);
    if(old){if(!same(old.input,input))throw new SyncError('INVALID','Operation conflict');return structuredClone(old.result);}
    if(input.expectedRevision!==(this.snapshot?.revision??0))throw new SyncError('CONFLICT','Stale cloud revision');
    const result:CloudSnapshot={owner:this.owner,revision:input.expectedRevision+1,operationId:input.operationId,schema:1,payload:structuredClone(input.payload)};
    this.snapshot=result;this.receipts.set(input.operationId,{input:structuredClone(input),result:structuredClone(result)});
    if(this.loseAck){this.loseAck=false;throw new SyncError('NETWORK','Acknowledgement lost');}return structuredClone(result);
  }
}
