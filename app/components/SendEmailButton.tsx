"use client";
import { toast } from "sonner";
import { sendEmailAction } from "../email-actions";
import { useSession } from "@/lib/auth-client";

export default function SendEmailButton() {
  const session = useSession();
  const handleSendEmail = async () => {
    if (!session.data?.user.email) return;
    const email = sendEmailAction(
      session.data.user.email,
      "Welcome to SAAS Template",
      "This email is sent using RESEND!"
    );

    toast.promise(email, {
      loading: "Sending email...",
      success: "Email sent successfully",
      error: "Failed to send email",
    });
  };

  return (
    <button
      onClick={handleSendEmail}
      className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 font-medium"
      disabled={!session.data?.user.email}
    >
      Send Welcome Email
    </button>
  );
}
