import { useNavigate, useParams } from "react-router-dom";
import { Article, Tag } from "../types/types";
import { getFilteredArticles } from "../api/articlesService";
import { useQuery } from "@tanstack/react-query";
import { NewArticleModal } from "./NewArticleModal";
import { Tag as TagUI } from "./ui/Tag";

/**
 * Renders an individual article item.
 *
 * @param article - The article object to display.
 */
export const ArticleItem = ({ article }: { article: Article }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/articles/${article.categoryId}/${article.id}`);
  };

  return (
    <div
      className="h-72 border rounded bg-white p-5 shadow-lg cursor-pointer flex flex-col justify-between"
      onClick={handleClick}
    >
      <div>
        <h1 className="text-xl mb-3 underline capitalize">{article.title}</h1>
        <p className="text-ellipsis line-clamp-3 text-gray-500">
          {article.description}
        </p>
      </div>
      <TagsList tags={article.tags || []} />
    </div>
  );
};

/**
 * Renders a list of tags.
 *
 * @param tags - An array of tags.
 * @returns The rendered list of tags.
 */
export const TagsList = ({ tags }: { tags: Tag[] }) => {
  if (tags.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-wrap gap-2 items-end">
      {tags.map((tag) => (
        <TagUI key={tag.id} title={tag.title} />
      ))}
    </div>
  );
};

/**
 * Renders a list of articles based on the selected category.
 */
export const ArticlesList = () => {
  const { category } = useParams() as { category: string };

  const { data: articles } = useQuery({
    queryKey: ["articles", category],
    queryFn: () => getFilteredArticles(category),
  });

  return (
    <div className="h-full p-10 bg-slate-200">
      <div className="flex justify-between items-center">
        <NewArticleModal />
      </div>
      <div className="grid grid-cols-3 gap-10 mt-5">
        {articles?.map((article) => (
          <ArticleItem key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};
