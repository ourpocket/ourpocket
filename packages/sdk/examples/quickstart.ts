import { randomUUID } from 'node:crypto';
import { OurPocket } from '../src/index';
const baseUrl=process.env.OURPOCKET_BASE_URL??'http://127.0.0.1:3000/v1';
const dashboardToken=process.env.OURPOCKET_DASHBOARD_TOKEN;
async function dashboard<T>(path:string,body:unknown):Promise<T>{
  if(!dashboardToken) throw new Error('Set OURPOCKET_DASHBOARD_TOKEN to the JWT returned by /v1/auth/login');
  const response=await fetch(`${baseUrl}${path}`,{method:'POST',headers:{Authorization:`Bearer ${dashboardToken}`,'Content-Type':'application/json','X-Environment':'sandbox'},body:JSON.stringify(body)});
  if(!response.ok) throw new Error(`Dashboard request failed: ${response.status}`);
  return (await response.json()).data as T;
}
let apiKey=process.env.OURPOCKET_API_KEY;
if(!apiKey){const project=await dashboard<{id:string;sandboxKey:string}>('/projects',{name:`SDK sandbox ${randomUUID().slice(0,8)}`});apiKey=project.sandboxKey;console.log('Project created:',project.id);console.log('Save the sandbox key now (shown once):',apiKey);}
if(!apiKey.startsWith('op_test_sk_')) throw new Error('This quickstart only executes simulated sandbox operations');
const pocket=new OurPocket({apiKey,baseUrl});const context=await pocket.context.get();
if(process.env.OURPOCKET_WEBHOOK_URL){const endpoint=await dashboard<{id:string;secret:string}>(`/projects/${context.projectId}/financial/webhooks`,{url:process.env.OURPOCKET_WEBHOOK_URL,events:'payment.completed,refund.completed,transfer.completed'});console.log('Save this endpoint signing secret once:',endpoint.secret);console.log('Run webhook-receiver.ts with OURPOCKET_WEBHOOK_SECRET before replaying an event from the dashboard.');}
const write=()=>({idempotencyKey:randomUUID()});
const customer=await pocket.customers.create({email:'sandbox@example.test'},write());
const payment=await pocket.payments.create({customer:customer.id,amount:'50000',currency:'NGN'},write());
const refund=await pocket.refunds.create({payment:payment.id,amount:'10000'},write());
const from=await pocket.wallets.create({currency:'NGN'},write());const to=await pocket.wallets.create({currency:'NGN'},write());
await pocket.wallets.fund(from.id,{amount:'20000',currency:'NGN'},write());
const transfer=await pocket.transfers.create({fromWallet:from.id,toWallet:to.id,amount:'5000',currency:'NGN'},write());
console.log(JSON.stringify({payment,refund,transfer,balances:{from:(await pocket.wallets.get(from.id)).details.balance,to:(await pocket.wallets.get(to.id)).details.balance},events:await pocket.events.list()},null,2));
console.log('Production: connect Paystack or Flutterwave in Production, create a live key, then instantiate OurPocket with that key. Do not pass a scenario. Initialize hosted checkout, then verify before settlement.');
