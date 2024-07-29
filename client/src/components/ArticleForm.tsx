import TagInput from "@eidellev/react-tag-input";
import { Article } from "../types/types";
import { useEffect, useRef, useState } from "react";
import { useCategories } from "../hooks/useCategories";
import { useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { Code } from "./markdown/Code";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

/**
 * Represents a form for creating or editing an article.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Article} props.article - The article object to be edited or an empty object for creating a new article.
 * @param {Function} props.onSubmit - The function to be called when the form is submitted.
 * @param {Function} props.onCancel - The function to be called when the form is canceled.
 * @returns {JSX.Element} The rendered form component.
 */
export const ArticleForm = ({
  article,
  onSubmit,
  onCancel,
}: {
  article: Article;
  onSubmit: (article: Article) => void;
  onCancel: () => void;
}) => {
  const { category: currentCategory } = useParams() as { category: string };
  const { categories } = useCategories();
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const categoryIdRef = useRef<HTMLSelectElement>(null);
  const [tags, setTags] = useState<string[]>(
    article.tags.map((tag) => tag.title)
  );
  const [value, setValue] = useState(article.body || "");
  const rtlValue = `<div align="right" dir="rtl">
  
  ${value}
  
  </div>`;

  const onChange = (tags: string[]) => {
    setTags(tags);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...article,
      title: titleRef.current?.value || "",
      description: descriptionRef.current?.value || "",
      body: value.startsWith("<div") ? value: rtlValue,
      categoryId: categoryIdRef.current?.value || "",
      tags: tags.map((tag) => ({ title: tag, id: tag, description: "" })),
    });
  };

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.value = article.title;
    }
    if (descriptionRef.current) {
      descriptionRef.current.value = article.description;
    }
    if (categoryIdRef.current) {
      categoryIdRef.current.value = article.categoryId;
    }
  }, [article]);

  return (
    <form onSubmit={handleSubmit} className="">
      <div className="mb-4">
        <label htmlFor="title" className="block">
          Title
        </label>
        <input
          type="text"
          id="title"
          ref={titleRef}
          className="w-full border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block">
          Description
        </label>
        <textarea
          id="description"
          ref={descriptionRef}
          className="w-full border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="body" className="block">
          Body
        </label>
        <MDEditor
          id="body"
          value={value}
          onChange={setValue}
          previewOptions={{
            components: {
              code: Code,
            },
          }}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="category" className="block">
          Category
        </label>
        <select
          id="category"
          ref={categoryIdRef}
          defaultValue={currentCategory}
          className="w-full border border-gray-300 rounded"
        >
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <TagInput
          value={tags}
          onChange={onChange}
          colorize
          placeholder="New Tag"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="mr-2 bg-red-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
};
