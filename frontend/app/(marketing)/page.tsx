import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    CheckCircle2,
    FileText,
    ScanLine,
    Award,
    Zap
} from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Navigation */}
            <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                            <Award className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold font-heading tracking-tight">Redacao.ai</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <Link href="#features" className="hover:text-foreground transition-colors">Como funciona</Link>
                        <Link href="#pricing" className="hover:text-foreground transition-colors">Preços</Link>
                        <Link href="#testimonials" className="hover:text-foreground transition-colors">Depoimentos</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium hover:text-primary hidden sm:block">
                            Entrar
                        </Link>
                        <Link href="/dashboard">
                            <Button>Começar Agora</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden py-20 lg:py-32">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

                    <div className="container mx-auto px-4 relative">
                        <div className="max-w-3xl mx-auto text-center space-y-8">
                            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
                                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                                Nova IA Especialista em Editais
                            </div>

                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading tracking-tight text-foreground">
                                Sua Redação Corrigida <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-indigo-600">
                                    Como na Banca
                                </span>
                            </h1>

                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                Receba uma correção detalhada, nota precisa e feedback criterioso em segundos.
                                A única IA treinada com os critérios reais da Cebraspe, FGV e Vunesp.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                <Link href="/dashboard" className="w-full sm:w-auto">
                                    <Button size="lg" className="w-full h-12 px-8 text-base">
                                        Corrigir Minha Redação
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
                                    Ver Exemplo de Correção
                                </Button>
                            </div>

                            <div className="pt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>Correção Instantânea</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>Critérios Oficiais</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>OCR de Manuscritos</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features / How it Works */}
                <section id="features" className="py-20 bg-muted/30 border-t border-border/50">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold font-heading mb-4">Como funciona o Redacao.ai</h2>
                            <p className="text-muted-foreground">
                                Simples, rápido e direto ao ponto. Você foca em escrever, nós focamos em evoluir sua nota.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <ScanLine className="w-10 h-10 text-primary" />,
                                    title: "1. Envie sua Redação",
                                    description: "Tire uma foto da sua folha de redação ou envie o PDF. Nossa tecnologia OCR lê até as letras mais difíceis."
                                },
                                {
                                    icon: <FileText className="w-10 h-10 text-primary" />,
                                    title: "2. Análise Profunda",
                                    description: "A IA cruza seu texto com o edital do seu concurso. Identificamos desvios gramaticais, coesão e fuga ao tema."
                                },
                                {
                                    icon: <Award className="w-10 h-10 text-primary" />,
                                    title: "3. Receba sua Nota",
                                    description: "Em segundos, você recebe um relatório completo com nota, gráficos de desempenho e dicas para chegar na nota máxima."
                                }
                            ].map((feature, i) => (
                                <div key={i} className="bg-card border border-border/50 rounded-2xl p-8 hover:border-primary/50 transition-colors shadow-sm">
                                    <div className="mb-6 bg-primary/10 w-fit p-4 rounded-xl">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold font-heading mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5"></div>
                    <div className="container mx-auto px-4 relative text-center">
                        <h2 className="text-4xl font-bold font-heading mb-6">Pronto para aumentar sua nota?</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                            Não espere o dia da prova para descobrir seus erros. Comece a praticar agora com a correção mais rigorosa do mercado.
                        </p>
                        <Link href="/dashboard">
                            <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                                <Zap className="w-5 h-5 mr-2 fill-current" />
                                Começar Agora Gratuitamente
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-border bg-muted/10 py-12">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <div className="flex items-center justify-center gap-2 mb-4 font-bold text-foreground font-heading">
                        <Award className="w-5 h-5" />
                        Redacao.ai
                    </div>
                    <p>© 2024 Redacao.ai. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
