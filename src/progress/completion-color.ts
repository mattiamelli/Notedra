export function completionColor(percentage:number){
 const stops=[[0,0],[25,28],[50,52],[75,82],[100,128]] as const;let hue=0;
 for(let i=1;i<stops.length;i++)if(percentage<=stops[i][0]){const [x0,h0]=stops[i-1],[x1,h1]=stops[i];hue=h0+(h1-h0)*(percentage-x0)/(x1-x0);break;}
 if(percentage>=100)hue=128;return `hsl(${Math.round(hue)} 72% 42%)`;
}
