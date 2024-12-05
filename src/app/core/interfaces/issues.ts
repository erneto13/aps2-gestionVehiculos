export interface Issues {
    issues_id: number;
    title: string;
    description: string;
    issueType: string;
    status: string;
    evidence: string[];
    comments?: string;
    reportedBy: string;
    reportDate: string;
    resolvedBy?: string;
    resolvedDate?: string;
}

export interface Issue {
    title: string;
    description: string;
    issueType: string;
    status: string;
    evidence: string[];
    reportedBy: string;
    reportDate: string;
}

export interface IssueUpdate {
    issues_id: number;
    status: string;
    resolvedBy?: string;
    resolvedDate?: string;
    comments?: string;
}

export interface NewIssue {
    title: string;
    description: string;
    issueType: string;
    status: string;
    evidence: string[];
    comments?: string;
    reportedBy: string;
    reportDate: string;
    resolvedBy?: string;
    resolvedDate?: string;
}

export enum IssueType {
    VEHICLES = 'Vehículos',
    VEHICLE_ASSIGNMENT = 'Asignación de vehículos',
    INSPECTIONS = 'Inspecciones',
    SERVICES = 'Servicios',
    AUTO_PARTS = 'Auto Partes',
    FUEL = 'Combustible'
}