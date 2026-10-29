import {cookies} from 'next/headers';
import {createHmac} from 'node:crypto';
export async function authorised(){const token=(await cookies()).get('admin')?.value||'';const [expiry,sig]=token.split('.');return Boolean(process.env.ADMIN_SECRET&&Number(expiry)>Date.now()&&sig===createHmac('sha256',process.env.ADMIN_SECRET).update(expiry).digest('hex'))}
