"use client";
import { authClient, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SpendCreditButton() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSpendCredit = async () => {
    try {
      if (!session) return;
      await authClient.updateUser({
        credits: session.user.credits - 1,
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to update credits:", error);
    }
  };

  return (
    <button
      onClick={handleSpendCredit}
      className="w-full bg-primary hover:bg-primary/80 text-primary-foreground py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 font-medium"
      disabled={!session || session.user.credits <= 0}
    >
      Spend 1 Credit ({session?.user.credits || 0} available)
    </button>
  );
}
