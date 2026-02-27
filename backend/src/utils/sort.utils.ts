export type SortOrder = 'asc' | 'desc';

export function sortBy<T>(arr: T[], field: keyof T, order: SortOrder = 'asc'): T[] {
    return [...arr].sort((a, b) => {
        if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
        return 0;
    });
}