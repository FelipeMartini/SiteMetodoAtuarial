"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

export default function TotpSetup() {
  const [qr, setQr] = useState<string | null>(null);
  const [otpauth, setOtpauth] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [step, setStep] = useState<"setup" | "verify" | "done">("setup");

  // Inicia setup TOTP
  const handleSetup = async () => {
    setErro(null);
    setStatus(null);
    const res = await fetch("/api/auth/totp-setup", { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      setErro(data.error || "Erro ao gerar QR code.");
      return;
    }
    setQr(data.qr);
    setOtpauth(data.otpauth);
    setStep("verify");
  };

  // Verifica código TOTP
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setStatus(null);
    const res = await fetch("/api/auth/totp-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setErro(data.error || "Token inválido.");
      return;
    }
    setStatus("MFA ativado com sucesso!");
    setStep("done");
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Ativar Autenticação em 2 Fatores (TOTP)</CardTitle>
      </CardHeader>
      <CardContent>
        {step === "setup" && (
          <Button onClick={handleSetup} className="w-full">Gerar QR Code</Button>
        )}
        {step === "verify" && qr && (
          <div className="flex flex-col items-center gap-4">
            <img src={qr} alt="QR Code MFA" className="w-40 h-40" />
            <form onSubmit={handleVerify} className="w-full flex flex-col gap-2">
              <Input
                type="text"
                placeholder="Digite o código do app"
                value={token}
                onChange={e => setToken(e.target.value)}
                maxLength={6}
                minLength={6}
                required
              />
              <Button type="submit" className="w-full">Verificar</Button>
            </form>
          </div>
        )}
        {step === "done" && status && (
          <Alert className="border-green-500/60 text-green-600 dark:text-green-400 bg-green-50/70 dark:bg-green-950/30">
            {status}
          </Alert>
        )}
        {erro && <Alert variant="destructive">{erro}</Alert>}
      </CardContent>
    </Card>
  );
}
