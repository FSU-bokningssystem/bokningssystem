import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const browserZone =
    Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Stockholm";

const supported: string[] =
    (
        Intl as unknown as {
            supportedValuesOf?: (key: string) => string[];
        }
    ).supportedValuesOf?.("timeZone") ?? [];

const timeZones = Array.from(
    new Set([browserZone, "Europe/Stockholm", ...supported]),
);

const inputClass =
    "w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 focus:border-[#0058a3] focus:ring-[#0058a3]";
const labelClass = "mb-1 block text-xs font-bold uppercase text-gray-700";

const RegisterPage = () => {
    const { register, isAuthenticated } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    if (isAuthenticated) return <Navigate to="/" replace />;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setError("Lösenorden matchar inte.");
            return;
        }

        setSubmitting(true);
        try {
            await register({
                firstName: formData.get("firstName") as string,
                lastName: formData.get("lastName") as string,
                email: formData.get("email") as string,
                phone: (formData.get("phone") as string) || undefined,
                timeZone: formData.get("timeZone") as string,
                password,
                confirmPassword,
            });
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Registreringen misslyckades",
            );
            setSubmitting(false);
        }
    };

    return (
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8 pt-6">
            <div className="rounded-md bg-[#0058a3] px-6 py-3 text-3xl font-extrabold tracking-wide text-[#ffdb00]">
                LOGOTYPE
            </div>

            <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
                <h2 className="border-b border-gray-100 pb-4 text-lg font-bold text-gray-900">
                    Skapa konto
                </h2>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className={labelClass}>
                                Förnamn
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                id="firstName"
                                autoComplete="given-name"
                                className={inputClass}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className={labelClass}>
                                Efternamn
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                id="lastName"
                                autoComplete="family-name"
                                className={inputClass}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className={labelClass}>
                            E-post
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            autoComplete="email"
                            className={inputClass}
                            placeholder="namn@foretag.se"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className={labelClass}>
                            Telefon
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            autoComplete="tel"
                            className={inputClass}
                            placeholder="(valfritt)"
                        />
                    </div>

                    <div>
                        <label htmlFor="timeZone" className={labelClass}>
                            Tidszon
                        </label>
                        <select
                            name="timeZone"
                            id="timeZone"
                            defaultValue={browserZone}
                            className={inputClass}
                            required
                        >
                            {timeZones.map(zone => (
                                <option key={zone} value={zone}>
                                    {zone}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="password" className={labelClass}>
                            Lösenord
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            autoComplete="new-password"
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className={labelClass}>
                            Bekräfta lösenord
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            autoComplete="new-password"
                            className={inputClass}
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#0058a3] px-5 py-2 text-sm font-bold text-white shadow-xs transition hover:bg-[#004f93] disabled:opacity-60"
                    >
                        <UserPlus className="h-4 w-4" />
                        {submitting ? "Skapar konto..." : "Skapa konto"}
                    </button>
                </form>

                <p className="mt-5 border-t border-gray-100 pt-4 text-center text-sm text-gray-600">
                    Har du redan ett konto?{" "}
                    <Link
                        to="/login"
                        className="font-bold text-[#0058a3] hover:underline"
                    >
                        Logga in
                    </Link>
                </p>
            </div>
        </div>
    );
};
export default RegisterPage;
