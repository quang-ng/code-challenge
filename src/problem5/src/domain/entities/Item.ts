export type Item = {
  id: number;
  name: string;
  description: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateItemInput = {
  name: string;
  description?: string | null;
  tags?: string[];
};

export type UpdateItemInput = Partial<{
  name: string;
  description: string | null;
  tags: string[];
}>;

export type ListItemsFilters = {
  q?: string;
  createdBefore?: string;
  createdAfter?: string;
  limit?: number;
  offset?: number;
  tag?: string;
};

