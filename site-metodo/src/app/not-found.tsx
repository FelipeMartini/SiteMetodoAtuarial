"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export default function NotFound() {
   return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
         <Card variant="glass" padding="default" className="w-full max-w-md shadow-xl border-primary/30">
            <CardHeader className="flex flex-col items-center gap-2">
               <Avatar className="mb-2 h-16 w-16">
                  <AvatarFallback className="text-3xl bg-primary text-primary-foreground">404</AvatarFallback>
               </Avatar>
               <CardTitle className="text-center text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Página não encontrada
               </CardTitle>
               <CardDescription className="text-center text-muted-foreground">
                  Não conseguimos encontrar a página que você procurava.<br />
                  Se precisar de ajuda, entre em contato com nossa equipe atuarial.
               </CardDescription>
            </CardHeader>
            <Separator className="my-2" />
            <CardContent className="flex flex-col items-center gap-4">
               <Button asChild variant="outline" className="w-full">
                  <Link href="/">Voltar para a página inicial</Link>
               </Button>
            </CardContent>
            <CardFooter className="justify-center text-xs text-muted-foreground">
               Método Atuarial &copy; {new Date().getFullYear()}
            </CardFooter>
         </Card>
      </div>
   );
}