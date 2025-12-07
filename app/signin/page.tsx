import { SignInForm } from "@/components/signin-form"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from "react-redux";
import { USER_TYPES, selectUser, selectUserType, setUser, setUserType } from "../../features/user/userSlice";
import { selectUserEmail,  setUserEmail } from "../../features/user/userActiveEmail";
import {selectToken, setToken} from "../../features/token/tokenSlice";
import Head from "next/head"
import useLogin from "../../hooks/useLogin";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export function LoginError() {
  return (
    <div id="alert-2" class="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
      <svg class="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <span class="sr-only">Info</span>
      <div class="ml-3 text-sm text-center font-medium">
        Email or password is incorrect.
      </div>

    </div>
  )
}

const signupSuccess = <div class="flex items-center text-center p-4 mb-4 text-sm text-green-800 border border-0 bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800" role="alert">
<svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
</svg>
<span class="sr-only">Info</span>
<div>
You have created a new account, please login to complete your profile
</div>
</div>

export default function SignInPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectUser);
  const user_email = useSelector(selectUserEmail);
  const [isLoading, setIsLoading] = useState(false)
  const token = useSelector(selectToken);
  const [formErr, setFormErr] = useState(null)
  const searchParams = useSearchParams()
  const search = searchParams.get('user')
  const [spinner, setSpinner] = useState(false)	

  const { isIdle, isPending, error, mutateAsync: loginFn } = useLogin("https://avantrades-api.onrender.com/auth/jwt/create/", loginSuccess, USER_TYPES.user)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })


  const inputChangeHandler = (e) => {
    const { name, value } = e.target
    setFormData((prevValue) => {
      return {
        ...prevValue,
        [name]: value
      }
    })

  }
 
  async function loginEmail(){
    dispatch(setUserEmail(formData?.email))
    console.log("User Email: ", user_email)
  
  }

  loginEmail()
  
  async function loginSuccess() {
    
        console.log("Successful Login")
        const today = new Date();
        const oneMonthFromToday = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
        document.cookie = `user_type=user; expires=${oneMonthFromToday.toUTCString()} Path=/`
    
        console.log(document.cookie)
    }


  const submit = async (e) => {
    e.preventDefault();  
    try {
      
      await loginFn(formData)    
      loginSuccess()

    } catch (error) {
      console.log(error)
      setSpinner(false)
      setFormErr(error)
    }
  };
  
  if (user !== null) {

    router.push("/dashboard");
    
  }
  

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo and branding */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl text-foreground">Playground</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
          <p className="text-foreground/60">Sign in to your Playground account</p>
        </div>

       <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          required
          className="bg-secondary border-border text-foreground placeholder:text-foreground/40"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-foreground">
            Password
          </Label>
          <a href="#" className="text-sm text-primary hover:text-accent transition-colors">
            Forgot password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          required
          className="bg-secondary border-border text-foreground placeholder:text-foreground/40"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold py-2 rounded-lg transition-colors"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-foreground/60">Or continue with</span>
        </div>
      </div>
 
    </form>

        {/* Sign up link */}
        <p className="text-center text-foreground/60 mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:text-accent font-semibold transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
