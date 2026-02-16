import { redirect } from 'next/navigation';

export default function RootPage() {
  // User ko /pages/Home par hamesha redirect kar dein
  redirect('/pages/Home');

  // Yeh component kuch bhi render nahi karega, kyunki redirect pehle hi ho jayega.
  // Hum yahan null ya ek simple loading message return kar sakte hain.
  return null; 
}