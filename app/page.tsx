import { getSession } from "@/lib/server";
import Image from "next/image";
import GoogleSignInButton from "./components/GoogleSignInButton";
import GitHubSignInButton from "./components/GitHubSignInButton";
import SignOutButton from "./components/SignOutButton";

export default async function Home() {
  const session = await getSession();

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Welcome Back!
            </h1>

            <div className="mb-6">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full mx-auto mb-4"
                />
              )}
              <p className="text-lg font-medium text-gray-900">
                {session.user.name}
              </p>
              <p className="text-sm text-gray-600">{session.user.email}</p>
            </div>
            {/* Session Data for debugging */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-gray-900 mb-2">Session Info:</h3>
              <pre className="text-xs text-gray-600 overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>

            <SignOutButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h1>

          <div className="space-y-4">
            <GoogleSignInButton />
            <GitHubSignInButton />
          </div>
        </div>
      </div>
    </div>
  );
}
