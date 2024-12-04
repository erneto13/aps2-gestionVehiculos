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

export interface Issue {
    title: string;
    description: string;
    issue_type: string;
    status: string;
    evidence: string[];
    reportedBy: string;
    reportDate: string;
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

export interface IssueUpdate {
    idissues: number;
    status: string;
    resolvedBy: string;
    resolvedDate: string;
    comments: string;
}

export enum IssuesType {
    VEHICULOS = 'Vehículos',
    ASIGNACION_DE_VEHICULOS = 'Asignación de vehículos',
    INSPECCIONES = 'Inspecciones',
    SERVICIOS = 'Servicios',
    AUTO_PARTES = 'Auto-Partes',
    COMBUSTIBLE = 'Combustible'
}