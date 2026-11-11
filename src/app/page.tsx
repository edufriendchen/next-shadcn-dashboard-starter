import { redirect } from 'next/navigation';

// Landing route: the middleware protects /dashboard, so unauthenticated
// visitors are already sent to /auth/sign-in before reaching here.
export default function Page() {
  redirect('/dashboard/overview');
}
