"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

export default function SignUpPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      })

      if (error) throw error

    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to sign up. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 p-4 sm:p-6 md:p-8 bg-card rounded-lg shadow-lg mx-auto my-auto">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">Create an account</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Sign up to get started with our platform
          </p>
        </div>
        <div className="space-y-4">
          <Button
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full flex items-center justify-center"
            variant="outline"
          >
            <Image
              src="/google-logo.svg"
              alt="Google logo"
              width={20}
              height={20}
              className="mr-2"
            />
            {loading ? "Signing up..." : "Continue with Google"}
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button
            onClick={() => router.push("/signup/email")}
            className="w-full flex items-center justify-center"
            variant="outline"
          >
            Continue with Email
          </Button>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={() => router.push("/login")}
          >
            Log in
          </Button>
        </p>
      </div>
    </div>
  )
} 