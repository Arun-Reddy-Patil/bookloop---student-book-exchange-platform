/**
 * ExchangeRequest Model & Schema definition for BookLoop (MERN Stack)
 */
export interface IExchangeRequest {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  bookPrice: number;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  buyerCollege: string;
  buyerEmail: string;
  buyerPhone?: string;
  requestType: 'Purchase' | 'Exchange';
  offeredBookOrCash?: string;
  message: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Cancelled' | 'Completed';
  createdAt: string;
  updatedAt: string;
}
