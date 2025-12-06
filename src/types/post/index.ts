// Post Response Types
export interface PostResponse {
  id: number;
  title: string;
  slug: string;
  shortDescription?: string;
  thumbnailUrl?: string;
  content: string;
  published: boolean;
  viewCount?: number;
  createdAt?: string;
  updatedAt?: string;
  categoryName?: string;
  authorId?: string;
  authorName?: string;
}

export interface PostCategoryResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  postCount?: number;
}

// Post Request Types
export interface PostRequest {
  title: string;
  shortDescription?: string;
  thumbnailUrl?: string;
  content: string;
  published: boolean;
  categoryId: number;
}

export interface PostCategoryRequest {
  name: string;
  description?: string;
}
