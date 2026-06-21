import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Car, ShieldCheck, UserCog, Eye, EyeOff, AlertTriangle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();
  const [role, setRole] = useState<"admin" | "petugas">("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  const validateUsername = (value: string): string => {
    if (!value.trim()) return "Email tidak boleh kosong";
    if (!value.trim().endsWith("@gmail.com")) return "Format email harus @gmail.com";
    return "";
  };

  const validatePassword = (value: string): string => {
    if (!value) return "Password tidak boleh kosong";
    if (value.length <= 6) return "Password harus lebih dari 6 karakter";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const uError = validateUsername(username);
    const pError = validatePassword(password);
    setUsernameError(uError);
    setPasswordError(pError);
    if (uError || pError) return;

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", {
        username: username.trim(),
        password,
      });
      const userData = res.data.data;
      login({
        id: userData.id,
        username: userData.username,
        role: userData.role,
        nama: userData.nama,
      });
      navigate("/", { replace: true });
    } catch (err: any) {
      const resData = err.response?.data;
      if (
        resData?.data &&
        typeof resData.data === "object" &&
        typeof resData.data !== "string"
      ) {
        if (resData.data.username) setUsernameError(resData.data.username);
        if (resData.data.password) setPasswordError(resData.data.password);
      } else {
        setError(resData?.message || "Login gagal. Periksa koneksi server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* Left Side */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-10 flex flex-col justify-center items-center">
          <div className="bg-white/20 p-6 rounded-full mb-6">
            <Car size={70} />
          </div>

          <h1 className="text-4xl font-bold mb-3">
            Smart Parking
          </h1>

          <p className="text-center text-orange-100 max-w-sm">
            Sistem Manajemen Parkir Modern untuk mengelola kendaraan,
            transaksi, dan laporan secara efisien.
          </p>
        </div>

        {/* Right Side */}
        <div className="p-10 flex items-center justify-center">
          <div className="w-full max-w-md">

            <h2 className="text-3xl font-bold text-gray-800">
              Selamat Datang
            </h2>

            <p className="text-gray-500 mt-2 mb-8">
              Login untuk mengakses sistem Smart Parking
            </p>

            {/* Role Selector */}
            <div className="bg-gray-100 p-1 rounded-xl flex mb-6">
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${
                  role === "admin"
                    ? "bg-orange-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <ShieldCheck size={18} />
                Admin
              </button>

              <button
                type="button"
                onClick={() => setRole("petugas")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${
                  role === "petugas"
                    ? "bg-orange-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <UserCog size={18} />
                Petugas
              </button>
            </div>

            {/* Global Error */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-5 border border-red-200 text-sm flex items-center gap-2">
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (usernameError) setUsernameError(validateUsername(e.target.value));
                  }}
                  onBlur={() => setUsernameError(validateUsername(username))}
                  placeholder="Masukkan username"
                  className={`w-full border rounded-xl px-4 py-3 outline-none transition-all ${
                    usernameError
                      ? "border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-400"
                      : "border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  }`}
                  autoFocus
                />
                {usernameError && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertTriangle size={12} /> {usernameError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError(validatePassword(e.target.value));
                    }}
                    onBlur={() => setPasswordError(validatePassword(password))}
                    placeholder="Masukkan password"
                    className={`w-full border rounded-xl px-4 py-3 pr-12 outline-none transition-all ${
                      passwordError
                        ? "border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-400"
                        : "border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertTriangle size={12} /> {passwordError}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-orange-500"
                  />
                  Remember Me
                </label>

                <button
                  type="button"
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Lupa Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>Login sebagai {role === "admin" ? "Admin" : "Petugas"}</>
                )}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
