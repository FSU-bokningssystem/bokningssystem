import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { LogIn, Building, DoorClosed, CalendarCheck, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import OrganizationSelector from "../components/OrganizationSelector";

const LoginPage = () => {
    const { login, isAuthenticated, userOrganizations } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [selectingOrg, setSelectingOrg] = useState(false);
    const navigate = useNavigate();

    if (isAuthenticated && !selectingOrg) {
        return <Navigate to="/" replace />;
    } 

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        const formData = new FormData(e.currentTarget);
        try {
            await login({
                email: formData.get("email") as string,
                password: formData.get("password") as string,
            });
            // Aktivera organisationsval efter inloggning (om fler än 1 finns)
            setSelectingOrg(true);
            setSubmitting(false);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Inloggningen misslyckades",
            );
            setSubmitting(false);
        }
    };

    // Om användaren är inloggad och har flera organisationer: visa väljar-steget
    if (isAuthenticated && selectingOrg) {
        if (userOrganizations.length <= 1) {
            return <Navigate to="/" replace />;
        }
    
        return (
            <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8 pt-6">
                    <div className="rounded-md bg-[#0058a3] px-6 py-3 text-3xl font-extrabold tracking-wide text-[#ffdb00]">
                        LOGOTYPE
                    </div>

                    <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-xl space-y-5">
                        <h2 className="border-b border-gray-100 pb-4 text-lg font-bold text-gray-900">
                            Välj organisation
                        </h2>
                        <p className="text-sm text-gray-600">
                            Du är medlem i flera organisationer. Välj vilken du vill arbeta i:
                        </p>

                        <div className="py-2">
                            <OrganizationSelector />
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate("/", { replace: true })}
                            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#0058a3] px-5 py-2 text-sm font-bold text-white shadow-xs transition hover:bg-[#004f93]"
                        >
                            Fortsätt
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
        );
    }
    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-10 pt-6">
            <div className="rounded-md bg-[#0058a3] px-6 py-3 text-3xl font-extrabold tracking-wide text-[#ffdb00]">
                LOGOTYPE
            </div>

            <div className="grid w-full grid-cols-1 items-start gap-8 md:grid-cols-2">
                <section className="space-y-5">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Välkommen till bokningssystemet
                    </h1>
                    <p className="text-sm leading-relaxed text-gray-700">
                        Här hittar du lokaler i er organisations hus och kan
                        boka dem när det passar dig. Logga in för att komma
                        igång.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <Building className="mt-0.5 h-5 w-5 shrink-0 text-[#0058a3]" />
                            <div>
                                <p className="text-sm font-bold text-gray-900">
                                    Se husen och lokalerna
                                </p>
                                <p className="text-sm text-gray-600">
                                    Bläddra bland hus och se våning, beskrivning
                                    och om rummet går att boka.
                                </p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <CalendarCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0058a3]" />
                            <div>
                                <p className="text-sm font-bold text-gray-900">
                                    Boka rum
                                </p>
                                <p className="text-sm text-gray-600">
                                    Välj tid, bjud in deltagare och följ dina
                                    bokningar under Mina bokningar.
                                </p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <DoorClosed className="mt-0.5 h-5 w-5 shrink-0 text-[#0058a3]" />
                            <div>
                                <p className="text-sm font-bold text-gray-900">
                                    Hantera lokaler
                                </p>
                                <p className="text-sm text-gray-600">
                                    Lägg till och redigera lokaler i din
                                    organisation.
                                </p>
                            </div>
                        </li>
                    </ul>
                </section>

                <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
                    <h2 className="border-b border-gray-100 pb-4 text-lg font-bold text-gray-900">
                        Logga in
                    </h2>

                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1 block text-xs font-bold uppercase text-gray-700"
                            >
                                E-post
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="email"
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 focus:border-[#0058a3] focus:ring-[#0058a3]"
                                placeholder="namn@foretag.se"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1 block text-xs font-bold uppercase text-gray-700"
                            >
                                Lösenord
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                autoComplete="current-password"
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 focus:border-[#0058a3] focus:ring-[#0058a3]"
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
                            <LogIn className="h-4 w-4" />
                            {submitting ? "Loggar in..." : "Logga in"}
                        </button>
                    </form>

                    <p className="mt-5 border-t border-gray-100 pt-4 text-center text-sm text-gray-600">
                        Har du inget konto?{" "}
                        <Link
                            to="/register"
                            className="font-bold text-[#0058a3] hover:underline"
                        >
                            Registrera dig
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;
