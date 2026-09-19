import { createServer } from 'node:http';
import { createHmac, timingSafeEqual } from 'node:crypto';
const secret=process.env.OURPOCKET_WEBHOOK_SECRET;
if(!secret) throw new Error('Set OURPOCKET_WEBHOOK_SECRET to the one-time whsec_ signing secret');
// In production persist event IDs with your own business transaction. This in-memory set is only a quickstart.
const received=new Set<string>();
createServer(async(req,res)=>{
  if(req.method!=='POST'){res.writeHead(405);res.end();return;}
  let raw=Buffer.alloc(0);for await(const chunk of req){raw=Buffer.concat([raw,Buffer.from(chunk)]);if(raw.length>65536){res.writeHead(413);res.end();return;}}
  const header=req.headers['ourpocket-signature'];const fields=typeof header==='string'?Object.fromEntries(header.split(',').map(field=>field.split('='))):{};
  const timestamp=Number(fields.t);const expected=createHmac('sha256',secret).update(`${fields.t}.${raw.toString('utf8')}`).digest('hex');
  const actual=Buffer.from(fields.v1??'');const valid=Number.isFinite(timestamp)&&Math.abs(Date.now()/1000-timestamp)<=300&&actual.length===expected.length&&timingSafeEqual(actual,Buffer.from(expected));
  if(!valid){res.writeHead(401);res.end();return;}
  try{const event=JSON.parse(raw.toString('utf8')) as {id:string;type:string};if(!received.has(event.id)){received.add(event.id);console.log('Received event',event.id,event.type);}res.writeHead(200,{'Content-Type':'application/json'});res.end('{"accepted":true}');}catch{res.writeHead(400);res.end();}
}).listen(Number(process.env.PORT??8088),'127.0.0.1',()=>console.log('Webhook receiver on 8088. Expose it through your public HTTPS development ingress; private/local destinations are rejected.'));
