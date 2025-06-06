import { getSession } from "@/lib/server";
import Image from "next/image";
import GoogleSignInButton from "./components/GoogleSignInButton";
import GitHubSignInButton from "./components/GitHubSignInButton";
import SignOutButton from "./components/SignOutButton";
import SpendCreditButton from "./components/SpendCreditButton";
import SendEmailButton from "./components/SendEmailButton";
import { PaymentForm } from "./components/payment/BuyCredits";
import { getUser } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();
  console.log("GETTING USER");
  const user = await getUser(session?.user.id || "");
  const credits = user?.credits;

  if (session) {
    return (
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Welcome to Your
            <span className="text-muted-foreground"> Dashboard</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Manage your account, track your usage, and access all the features
            of our platform.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-6">
              <div className="text-center">
                <div className="mb-6">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-muted"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-muted flex items-center justify-center">
                      <span className="text-2xl font-bold text-foreground">
                        {session.user.name?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    {session.user.name}
                  </h3>
                  <p className="text-muted-foreground">{session.user.email}</p>
                </div>

                {/* Credits Display */}
                <div className="bg-muted/50 border rounded-xl p-4 mb-6">
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm mb-1">
                      Available Credits
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {credits}
                    </p>
                  </div>
                </div>

                <SignOutButton />
              </div>
            </div>
          </div>

          {/* Actions and Features */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Quick Actions
              </h3>
              <div className="space-y-4">
                <SpendCreditButton credits={credits} />
                <SendEmailButton />
                <PaymentForm />
              </div>
            </div>

            {/* Session Debug Info */}
            <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Session Information
              </h3>
              <div className="bg-background/50 rounded-xl p-4 border">
                <pre className="text-sm text-muted-foreground overflow-auto max-h-64">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Welcome to the Future of
            <span className="text-muted-foreground"> Business</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of businesses already using our platform to
            streamline their operations and boost productivity.
          </p>
        </div>

        {/* Sign In Card */}
        <div className="max-w-md mx-auto">
          <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Get Started Today
              </h2>
              <p className="text-muted-foreground">
                Sign in to access your dashboard
              </p>
            </div>

            <div className="space-y-4">
              <GoogleSignInButton />
              <GitHubSignInButton />
            </div>

            <div className="mt-8 pt-6 border-t">
              <p className="text-center text-sm text-muted-foreground">
                By signing in, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
