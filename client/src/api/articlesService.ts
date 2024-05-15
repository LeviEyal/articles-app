import axios from "axios";
import { Article, Category } from "../types/types";

const api = axios.create({
  baseURL: "/api",
});

export const getFilteredArticles = async (
  categoryId?: string,
  tags?: string[]
) => {
  const categoryIdParam = categoryId ? `?categoryId=${categoryId}` : "";
  const tagsParam = tags ? `?tags=${tags.join(",")}` : "";
  const limitParam = ``;

  const res = await api.get<Article[]>(
    `/articles${categoryIdParam}${tagsParam}${limitParam}`
  );
  return res.data;
};

export const createArticle = async (article: Article) => {
  const res = await api.post<Article>("/articles", article);
  return res.data;
};

export const updateArticle = async (article: Article) => {
  const res = await api.put<Article>(`/articles/${article.id}`, article);
  return res.data;
};

export const deleteArticle = async (id: string | number) => {
  const res = await api.delete<Article>(`/articles/${id}`);
  return res.data;
};

export const getArticle = async (id: string | number) => {
  const res = await api.get<Article>(`/articles/${id}`);
  return res.data;
};

export const getCategories = async () => {
  const res = await api.get<Category[]>("/categories");
  return res.data;
};

export const createCategory = async (category: Category) => {
  const res = await api.post<Category>("/categories", category);
  return res.data;
};
