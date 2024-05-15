import { useEffect, useRef, useState } from "react";
import { useModal } from "../hooks/useModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createArticle } from "../api/articlesService";
import { useCategories } from "../hooks/useCategories";
import { useParams } from "react-router-dom";
import { RiStickyNoteAddLine } from "react-icons/ri";
import TagInput from "@eidellev/react-tag-input";

/**
 * Renders a modal for creating a new article.
 * This component displays a form with input fields for title, description, body, category, and tags.
 * The user can enter the details of the new article and save it.
 * The modal can be opened by clicking a button.
 *
 * @returns The NewArticleModal component.
 */
export const NewArticleModal = () => {
  const queryClient = useQueryClient();
  const { category: currentCategory } = useParams() as { category: string };
  const { categories } = useCategories();
  const createArticleMutation = useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
  const { close, isOpen, open } = useModal();
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const categoryIdRef = useRef<HTMLSelectElement>(null);

  const [tags, setTags] = useState<string[]>([]);

  const onChange = (tags: string[]) => {
    setTags(tags);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const title = titleRef.current?.value;
    const description = descriptionRef.current?.value;
    const body = bodyRef.current?.value;

    if (!title || !description) {
      return;
    }

    createArticleMutation.mutate({
      title,
      description,
      categoryId: categoryIdRef.current?.value || "",
      tags: tags.map((tag) => ({ title: tag, id: tag, description: "" })) || [],
      body: body || "",
      id: "",
    });

    console.log(title, description);
    close();
  };

  useEffect(() => {
    if (isOpen) {
      titleRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div>
      <button
        className="border-black border border-dashed rounded-lg px-5 py-2 bg-slate-80 flex items-center gap-2"
        onClick={open}
      >
        <RiStickyNoteAddLine />
        New Article
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-black">
          <div className="bg-white p-6 rounded w-[800px]">
            <h2 className="text-2xl">New Article</h2>
            <form onSubmit={handleSubmit}>
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
                <textarea
                  id="body"
                  ref={bodyRef}
                  className="w-full border border-gray-300 rounded h-64"
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
                  onClick={close}
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
          </div>
        </div>
      )}
    </div>
  );
};
