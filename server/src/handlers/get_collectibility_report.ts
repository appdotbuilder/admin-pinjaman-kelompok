
export interface CollectibilityReport {
    loan_id: number;
    nomor_pinjaman: string;
    member_name: string;
    group_name: string;
    jumlah_pinjaman: number;
    sisa_pokok: number;
    days_overdue: number;
    collectibility_class: 'LANCAR' | 'DPK' | 'KURANG_LANCAR' | 'DIRAGUKAN' | 'MACET';
    risk_percentage: number;
}

export async function getCollectibilityReport(): Promise<CollectibilityReport[]> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is generating loan collectibility report (Laporan Kolektabilitas Pinjaman).
    // Should classify loans based on payment history and overdue days.
    return [];
}
