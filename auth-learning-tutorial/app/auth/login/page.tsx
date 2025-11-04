/* import { LoginForm } from "@/components/auth/login-form";

const LoginPage=()=>{
    return(
        <LoginForm/>
    );
}

export default LoginPage; */

import { LoginForm } from "@/components/auth/login-form";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center relative overflow-hidden">
      {/* Subtle radial overlays for depth (matching landing page) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-800/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-gray-700/10 via-transparent to-transparent"></div>

      <div className="relative z-10 w-full max-w-md px-6">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
