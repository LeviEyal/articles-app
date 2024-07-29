import { FaEdit } from "react-icons/fa";
import { Article } from "../types/types";
import { MdDelete } from "react-icons/md";
import { Tag } from "./ui/Tag";
import MDEditor from "@uiw/react-md-editor";
import { Code } from "./markdown/Code";

interface Action {
  title: string;
  icon: JSX.Element;
  onClick: () => void;
  color: string;
}

/**
 * Renders the actions bar component.
 *
 * @param actions - An array of Action objects representing the actions to be displayed.
 * @returns The rendered actions bar component.
 */
export const ActionsBar = ({ actions }: { actions: Action[] }) => {
  return (
    <div className="flex justify-end gap-2">
      {actions.map((action) => (
        <button
          key={action.title}
          onClick={action.onClick}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          style={{ backgroundColor: action.color }}
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
};

/**
 * Renders the view for an article.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Article} props.article - The article object to display.
 * @param {Function} props.onEdit - The function to handle the edit action.
 * @param {Function} props.onDelete - The function to handle the delete action.
 * @returns {JSX.Element} The rendered ArticleView component.
 */
export const ArticleView = ({
  article,
  onEdit,
  onDelete,
}: {
  article: Article;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const actions: Action[] = [
    {
      title: "Edit",
      icon: <FaEdit />,
      onClick: onEdit,
      color: "gray",
    },
    {
      title: "Delete",
      icon: <MdDelete />,
      onClick: onDelete,
      color: "#ff4041",
    },
  ];

  return (
    <div className="flex flex-col gap-5 text-lg">
      <div className="flex justify-between divide--2">
        <h1 className="text-3xl">{article?.title}</h1>
        <ActionsBar actions={actions} />
      </div>
      <div className="h-[1px] bg-gray-400"></div>
      <p className="text-gray-500">{article?.description}</p>
      <div className="resize-none p-2 h-full w-full focus:outline-none text-gray-900 bg-white rounded-lg whitespace-pre-line text-pretty">
        <MDEditor.Markdown
          source={article?.body || ""}
          style={{ whiteSpace: "pre-wrap" }}
          components={
            {
              code: Code,
            } as any
          }
        />
      </div>
      {article?.tags && article.tags.length > 0 && (
        <div className="flex gap-2">
          {article?.tags.map((tag) => (
            <Tag key={tag.id} title={tag.title} />
          ))}
        </div>
      )}
    </div>
  );
};
