export interface Post {
  id: string;
  post: string;
  createdAt?: string;
  replyToId?: string;
  replies?: [
    {
      createdAt: string;
      id: string;
      post: string;
      replyToId: string;
      updatedAt: string;
      user: string;
    },
  ];
}
