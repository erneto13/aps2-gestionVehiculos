export interface Issues {
    idissues: number;
    title: string;
    description: string;
    issue_type: string;
    status: string;
    evidence: string[];
    comments: string;
    reportDate: string;
    resolvedBy: string | null;
    resolvedDate: string | null;
}