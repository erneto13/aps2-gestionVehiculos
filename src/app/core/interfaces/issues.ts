export interface Issues {
    idissues: number;
    title: string;
    description: string;
    issue_type: string;
    status: string;
    evidence: string[];
    comments: string;
    reportedBy: string;
    reportedDate: string;
    resolvedBy: string | null;
    resolvedDate: string | null;
}

export interface NewIssues {
    title: string;
    description: string;
    issue_type: string;
    status: string;
    evidence: string[];
    reportedBy: string;
    reportedDate: string;
}

export enum IssueType {
    VEHICULOS,
    ASIGNACION_DE_VEHICULOS,
    INSPECCIONES,
    SERVICIOS,
    AUTO_PARTES,
    COMBUSTIBLE
}