import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteArticle,
  getArticle,
  updateArticle,
} from "../api/articlesService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Paper } from "./ui/Paper";
import { ArticleForm } from "./ArticleForm";
import { ArticleView } from "./ArticleView";

/**
 * Renders the ArticlePage component.
 * 
 * This component displays an article and provides functionality to edit and delete the article.
 * 
 * @returns The rendered ArticlePage component.
 */
export const ArticlePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const { id } = useParams() as { id: string };

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", id],
    queryFn: () => getArticle(id),
  });

  const updateArticleMutation = useMutation({
    mutationFn: updateArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["article", id] });
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: () => deleteArticle(id),
    onSuccess: () => {
      navigate("./..");
      queryClient.invalidateQueries({ queryKey: ["article", id] });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <div className="px-24 py-10 bg-slate-200 h-full">
      <Paper>
        {editMode ? (
          <ArticleForm
            article={article}
            onSubmit={(article) => {
              updateArticleMutation.mutate(article);
              setEditMode(false);
            }}
            onCancel={() => setEditMode(false)}
          />
        ) : (
          <ArticleView
            article={article}
            onEdit={() => setEditMode(true)}
            onDelete={deleteArticleMutation.mutate}
          />
        )}
      </Paper>
    </div>
  );
};
