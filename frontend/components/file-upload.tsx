"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
    label: string;
    accept: string;
    icon: React.ReactNode;
    description: string;
    file: File | null;
    onFileChange: (file: File | null) => void;
}

export function FileUpload({
    label,
    accept,
    icon,
    description,
    file,
    onFileChange,
}: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) {
                onFileChange(droppedFile);
            }
        },
        [onFileChange]
    );

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
                onFileChange(selectedFile);
            }
        },
        [onFileChange]
    );

    const handleRemove = useCallback(() => {
        onFileChange(null);
    }, [onFileChange]);

    return (
        <Card
            className={`relative transition-all duration-200 ${isDragging
                    ? "border-primary border-2 bg-primary/5"
                    : file
                        ? "border-green-500 bg-green-500/5"
                        : "border-dashed border-2 hover:border-primary/50"
                }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <CardContent className="p-6">
                <input
                    type="file"
                    accept={accept}
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id={`file-${label}`}
                />

                <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <div className={`p-3 rounded-full ${file ? "bg-green-500/10 text-green-500" : "bg-muted"}`}>
                        {icon}
                    </div>

                    <div>
                        <p className="font-medium text-sm">{label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{description}</p>
                    </div>

                    {file ? (
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-green-600 dark:text-green-400 truncate max-w-[200px]">
                                ✓ {file.name}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleRemove();
                                }}
                                className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                            >
                                Remover
                            </Button>
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground">
                            Arraste ou clique para selecionar
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
