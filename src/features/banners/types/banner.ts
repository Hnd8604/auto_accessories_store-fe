// Banner Response Types
export interface BannerResponse {
  id: number;
  title?: string;
  imageUrl: string;
  redirectUrl?: string;
  altText?: string;
  displayOrder?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Banner Request Types
export interface BannerRequest {
  title?: string;
  redirectUrl?: string;
  altText?: string;
  displayOrder?: number;
  isActive?: boolean;
}
