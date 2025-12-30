"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    CheckCircle2,
    AlertCircle,
    XCircle,
    Award,
    FileText,
    ChevronDown,
    ChevronUp,
    Target
} from "lucide-react";
import { useState } from "react";

interface Criterion {
    name: string;
    max_score: number;
    score: number;
    feedback: string;
}

interface GradeResultProps {
    transcription: string;
    extracted_criteria_summary?: string;
    criteria: Criterion[];
    total_score: number;
    max_total_score: number;
    general_feedback: string;
}

export function GradeResult({
    transcription,
    extracted_criteria_summary,
    criteria,
    total_score,
    max_total_score,
    general_feedback,
}: GradeResultProps) {
    const scorePercentage = (total_score / max_total_score) * 100;

    // UI State for simple accordion/expansion
    const [expandedCriterion, setExpandedCriterion] = useState<number | null>(null);

    const getScoreColor = (percentage: number) => {
        if (percentage >= 90) return "text-emerald-500";
        if (percentage >= 70) return "text-blue-500";
        if (percentage >= 50) return "text-yellow-500";
        return "text-red-500";
    };

    const getScoreBadgeBg = (percentage: number) => {
        if (percentage >= 90) return "bg-emerald-500/10 border-emerald-500/20";
        if (percentage >= 70) return "bg-blue-500/10 border-blue-500/20";
        if (percentage >= 50) return "bg-yellow-500/10 border-yellow-500/20";
        return "bg-red-500/10 border-red-500/20";
    };

    const getScoreIcon = (percentage: number) => {
        if (percentage >= 90) return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
        if (percentage >= 70) return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
        if (percentage >= 50) return <AlertCircle className="w-5 h-5 text-yellow-500" />;
        return <XCircle className="w-5 h-5 text-red-500" />;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Top Stats Row (Competitor Inspired: Quick Glace Stats) */}
            <div className="grid md:grid-cols-3 gap-4">
                {/* Main Score Card */}
                <Card className={`col-span-2 relative overflow-hidden border-2 ${getScoreBadgeBg(scorePercentage)}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Award className="w-32 h-32" />
                    </div>
                    <CardContent className="pt-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="text-center md:text-left">
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Nota Final</p>
                            <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight">
                                {total_score.toFixed(1)}
                                <span className="text-2xl text-muted-foreground font-normal ml-1">
                                    / {max_total_score}
                                </span>
                            </h2>
                            <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                                {getScoreIcon(scorePercentage)}
                                <span className="text-sm font-medium">
                                    {scorePercentage >= 90 ? "Excelente Desempenho" :
                                        scorePercentage >= 70 ? "Bom Desempenho" :
                                            "Precisa Melhorar"}
                                </span>
                            </div>
                        </div>

                        {/* Circular Progress (CSS based for simplicity/speed) */}
                        <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-background/50 bg-background/20 shadow-inner">
                            <div className="text-xl font-bold font-mono">
                                {Math.round(scorePercentage)}%
                            </div>
                            <svg className="absolute inset-0 w-full h-full -rotate-90 stroke-current text-primary" viewBox="0 0 100 100">
                                <circle className="text-muted/20" strokeWidth="8" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" />
                                <circle
                                    className={getScoreColor(scorePercentage)}
                                    strokeWidth="8"
                                    strokeDasharray={264}
                                    strokeDashoffset={264 - (264 * scorePercentage) / 100}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="42"
                                    cx="50"
                                    cy="50"
                                />
                            </svg>
                        </div>
                    </CardContent>
                </Card>

                {/* Edital / Context Card */}
                <Card className="flex flex-col justify-center bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                            <Target className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Foco da Banca</CardTitle>
                        <CardDescription>Critérios identificados</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="text-sm space-y-2 text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="bg-primary/20 w-1.5 h-1.5 rounded-full mt-1.5"></span>
                                <span className="flex-1 line-clamp-3">{extracted_criteria_summary || "Critérios padrão aplicados."}</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* detailed Criteria Column (The "coRedação" Competency List) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold font-heading flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Detalhamento por Competência
                        </h3>
                        <span className="text-sm text-muted-foreground">{criteria.length} critérios avaliados</span>
                    </div>

                    <div className="grid gap-4">
                        {criteria.map((criterion, index) => {
                            const isExpanded = expandedCriterion === index;
                            const percentage = (criterion.score / criterion.max_score) * 100;

                            return (
                                <Card
                                    key={index}
                                    className={`transition-all duration-200 border-l-4 ${isExpanded ? 'ring-2 ring-primary/20' : 'hover:border-l-primary/50'}`}
                                    style={{ borderLeftColor: percentage >= 70 ? 'var(--primary)' : percentage >= 50 ? 'var(--chart-3)' : 'var(--chart-4)' }}
                                >
                                    <div
                                        className="p-4 cursor-pointer"
                                        onClick={() => setExpandedCriterion(isExpanded ? null : index)}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-sm md:text-base pr-4">{criterion.name}</h4>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`font-mono font-bold ${getScoreColor(percentage)}`}>
                                                            {criterion.score}/{criterion.max_score}
                                                        </span>
                                                        {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                                    </div>
                                                </div>
                                                <Progress value={percentage} className="h-2" />
                                            </div>
                                        </div>

                                        {/* Expanded Feedback (Actionable advice) */}
                                        {isExpanded && (
                                            <div className="mt-4 pt-4 border-t border-border bg-muted/30 -mx-4 -mb-4 p-4 rounded-b-lg animate-in slide-in-from-top-2 duration-200">
                                                <div className="flex gap-3">
                                                    <div className="mt-1">
                                                        {getScoreIcon(percentage)}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-sm font-medium text-foreground">Análise da IA:</p>
                                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                                            {criterion.feedback}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Sidebar: General Feedback & Actions (The "Glau" utility sidebar) */}
                <div className="space-y-6">
                    <Card className="bg-primary/5 border-primary/20 sticky top-24">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-heading text-primary">Diagnóstico Geral</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {general_feedback}
                            </p>

                            <div className="pt-4 border-t border-primary/10">
                                <h4 className="text-sm font-medium mb-3">Transcrição (OCR)</h4>
                                <div className="bg-background/80 rounded border p-3 max-h-48 overflow-y-auto text-xs font-mono text-muted-foreground">
                                    {transcription}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
