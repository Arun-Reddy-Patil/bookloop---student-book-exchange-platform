/**
 * Report Model & Schema definition for BookLoop
 */
export interface IReport {
  id: string;
  bookId: string;
  bookTitle: string;
  sellerName: string;
  reportedById: string;
  reportedByName: string;
  reason: string;
  details: string;
  status: 'Pending' | 'Reviewed' | 'Dismissed' | 'Actioned';
  createdAt: string;
}
