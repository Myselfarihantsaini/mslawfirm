import {OAuth2Client} from 'google-auth-library';
export function google(){return new OAuth2Client(process.env.GOOGLE_CLIENT_ID,process.env.GOOGLE_CLIENT_SECRET,process.env.GOOGLE_REDIRECT_URI||'http://127.0.0.1:3000/api/auth/google/callback')}
export function ready(){return Boolean(process.env.GOOGLE_CLIENT_ID&&process.env.GOOGLE_CLIENT_SECRET&&process.env.ADMIN_GOOGLE_EMAILS&&process.env.ADMIN_SECRET)}
