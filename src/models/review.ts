export interface ProductReview {
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  author?: string;
  email?: string;
}
