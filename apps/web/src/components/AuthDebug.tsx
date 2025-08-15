import { useAuth, useUser } from '@clerk/clerk-react';

export default function AuthDebug() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();

  return (
    <div className="fixed top-4 right-4 bg-black text-white p-4 rounded-lg text-xs z-50 max-w-xs">
      <div className="font-bold mb-2">Auth Debug:</div>
      <div>isLoaded: {isLoaded ? 'true' : 'false'}</div>
      <div>isSignedIn: {isSignedIn ? 'true' : 'false'}</div>
      <div>userId: {userId || 'null'}</div>
      <div>user email: {user?.emailAddresses?.[0]?.emailAddress || 'null'}</div>
      <div>Current URL: {window.location.href}</div>
    </div>
  );
}
