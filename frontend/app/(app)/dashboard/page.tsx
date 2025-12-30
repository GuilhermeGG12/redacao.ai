"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileUpload } from "@/components/file-upload";
import { GradeResult } from "@/components/grade-result";

// Icons as simple SVG components
const ImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
);

const FileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
    </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z" />
        <path d="M5 3v4" />
        <path d="M19 17v4" />
        <path d="M3 5h4" />
        <path d="M17 19h4" />
    </svg>
);

interface GradeResponse {
    transcription: string;
    extracted_criteria_summary?: string;
    criteria: Array<{
        name: string;
        max_score: number;
        score: number;
        feedback: string;
    }>;
    total_score: number;
    max_total_score: number;
    general_feedback: string;
}

export default function DashboardPage() {
    const [essayFile, setEssayFile] = useState<File | null>(null);
    const [editalFile, setEditalFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState<GradeResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const canSubmit = essayFile && editalFile && !isLoading;

    const handleSubmit = async () => {
        if (!essayFile || !editalFile) return;

        setIsLoading(true);
        setError(null);
        setResult(null);
        setProgress(10);

        try {
            const formData = new FormData();
            formData.append("essay", essayFile);
            formData.append("edital", editalFile);

            setProgress(30);

            const response = await fetch("http://localhost:8000/api/grade", {
                method: "POST",
                body: formData,
            });

            setProgress(70);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Erro ao processar a redação");
            }

            const data: GradeResponse = await response.json();
            setProgress(100);
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setEssayFile(null);
        setEditalFile(null);
        setResult(null);
        setError(null);
        setProgress(0);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <SparklesIcon />
                        </div>
                        <h1 className="text-xl font-bold">Redacao.ai</h1>
                    </div>
                    <p className="text-sm text-muted-foreground hidden sm:block">
                        Dashboard do Aluno
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {!result ? (
                    <div className="space-y-8">
                        {/* Hero Section */}
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl font-bold tracking-tight">
                                Nova Correção
                            </h2>
                            <p className="text-muted-foreground max-w-xl mx-auto">
                                Envie a foto da sua redação manuscrita e o PDF do edital.
                            </p>
                        </div>

                        {/* Upload Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Enviar Arquivos</CardTitle>
                                <CardDescription>
                                    Selecione a imagem da redação e o PDF do edital com os critérios de correção
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FileUpload
                                        label="Redação"
                                        accept="image/*,.pdf"
                                        icon={<ImageIcon />}
                                        description="Foto ou PDF da redação manuscrita"
                                        file={essayFile}
                                        onFileChange={setEssayFile}
                                    />
                                    <FileUpload
                                        label="Edital"
                                        accept=".pdf"
                                        icon={<FileIcon />}
                                        description="PDF com os critérios de correção"
                                        file={editalFile}
                                        onFileChange={setEditalFile}
                                    />
                                </div>

                                {error && (
                                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                                        <p className="text-sm text-destructive">{error}</p>
                                    </div>
                                )}

                                {isLoading && (
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground text-center">
                                            Processando com IA...
                                        </p>
                                        <Progress value={progress} className="h-2" />
                                    </div>
                                )}

                                <Button
                                    onClick={handleSubmit}
                                    disabled={!canSubmit}
                                    className="w-full"
                                    size="lg"
                                >
                                    {isLoading ? (
                                        "Analisando..."
                                    ) : (
                                        <>
                                            <SparklesIcon />
                                            <span className="ml-2">Corrigir Redação</span>
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Resultado da Correção</h2>
                            <Button variant="outline" onClick={handleReset}>
                                Nova Correção
                            </Button>
                        </div>
                        <GradeResult {...result} />
                    </div>
                )}
            </main>
        </div>
    );
}
