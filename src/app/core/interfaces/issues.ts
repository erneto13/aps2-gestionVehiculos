export interface Issues {
    idissues: number;
    title: string;
    description: string;
    issue_type: string;
    status: string;
    evidence: string[];
    comments: string | null;
    reportedBy: string;
    reportDate: string;
    resolvedBy: string | null;
    resolvedDate: string | null;
}

export interface NewIssues {
    title: string;
    description: string;
    issue_type: string;
    status: string;
    evidence: string[];
    comments: string | null;
    reportedBy: string;
    reportDate: string;
    resolvedBy: string | null;
    resolvedDate: string | null;
}

export enum IssueType {
    Vehiculos,
    Asignacion_de_Vehiculos,
    Inspecciones,
    Servicios,
    Auto_Partes,
    Combustible
}