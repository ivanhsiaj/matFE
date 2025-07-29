// // const handleLogin = async (e: React.FormEvent) => {
// //   e.preventDefault();
// //   setIsLoading(true);
// //   setError('');

// //   try {
// //     // For demo purposes, using hardcoded credentials
// //     // In production, this would be an API call
// //     if (credentials.username === 'admin' && credentials.password === 'admin123') {
// //       localStorage.setItem('adminToken', 'demo-jwt-token');
// //       toast({
// //         title: "Login Successful",
// //         description: "Welcome to the Admin Dashboard",
// //       });
// //       navigate('/admin/dashboard');
// //     } else {
// //       setError('Invalid username or password');
// //     }
// //   } catch (err) {
// //     setError('Login failed. Please try again.');
// //   } finally {
// //     setIsLoading(false);
// //   }
// // };

// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Lock, ArrowLeft } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useToast } from '@/hooks/use-toast';

// const AdminLogin = () => {
//   const [credentials, setCredentials] = useState({
//     username: '',
//     password: ''
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const handleLogin = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setIsLoading(true);
//   setError('');

//   try {
//     const response = await fetch('http://localhost:5000/api/admin/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         usernameOrEmail: credentials.username,
//         password: credentials.password,
//       }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       setError(data.message || 'Invalid credentials');
//     } else {
//       localStorage.setItem('adminToken', data.token);
//       toast({
//         title: "Login Successful",
//         description: "Welcome to the Admin Dashboard",
//       });
//       navigate('/admin/dashboard');
//     }
//   } catch (err) {
//     setError('Login failed. Please try again.');
//   } finally {
//     setIsLoading(false);
//   }
// };


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <Button
//           variant="ghost"
//           onClick={() => navigate('/')}
//           className="mb-6"
//         >
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back to Home
//         </Button>

//         <Card>
//           <CardHeader className="text-center">
//             <div className="flex justify-center mb-4">
//               <Lock className="h-12 w-12 text-primary" />
//             </div>
//             <CardTitle className="text-2xl">Admin Login</CardTitle>
//             <CardDescription>
//               Enter your credentials to access the admin dashboard
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleLogin} className="space-y-4">
//               {error && (
//                 <Alert variant="destructive">
//                   <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//               )}
              
//               <div className="space-y-2">
//                 <Label htmlFor="username">Username</Label>
//                 <Input
//                   id="username"
//                   type="text"
//                   value={credentials.username}
//                   onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
//                   required
//                   placeholder="Enter username"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   value={credentials.password}
//                   onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
//                   required
//                   placeholder="Enter password"
//                 />
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full"
//                 disabled={isLoading}
//               >
//                 {isLoading ? 'Logging in...' : 'Login'}
//               </Button>
//             </form>

//             <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
//               <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Demo Credentials:</p>
//               <p className="text-sm text-blue-600 dark:text-blue-400">Username: admin</p>
//               <p className="text-sm text-blue-600 dark:text-blue-400">Password: admin123</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;
import { useState } from 'react';
import { useTranslation } from 'react-i18next'; // ✅
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { t } = useTranslation(); // ✅
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${backendUrl}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernameOrEmail: credentials.username,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || t('adminLogin.invalidCredentials'));
      } else {
        localStorage.setItem('adminToken', data.token);
        toast({
          title: t('adminLogin.loginSuccessTitle'),
          description: t('adminLogin.loginSuccessDesc'),
        });
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(t('adminLogin.loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('adminLogin.backToHome')}
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Lock className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">{t('adminLogin.title')}</CardTitle>
            <CardDescription>
              {t('adminLogin.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">{t('adminLogin.username')}</Label>
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  required
                  placeholder={t('adminLogin.usernamePlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('adminLogin.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  required
                  placeholder={t('adminLogin.passwordPlaceholder')}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? t('adminLogin.loggingIn') : t('adminLogin.login')}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              {/* <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">{t('adminLogin.demoCredentials')}</p> */}
              <p className="text-sm text-blue-600 dark:text-blue-400">{t('adminLogin.demoUsername')}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">{t('adminLogin.demoPassword')}</p>
              <Link className="text-sm text-blue-600 dark:text-blue-400" to='/change-password'>Forgot Password</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
