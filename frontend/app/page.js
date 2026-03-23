import { redirect } from 'next/navigation';

export default function RootPage() {
  // User ko /pages/Home par hamesha redirect kar dein
  redirect('/pages/Home');

  return null; 
}