import { useRef } from "react";
import { useModal } from "../hooks/useModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../api/articlesService";

/**
 * Renders a modal for creating a new category.
 */

export const NewCategoryModal = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
  const { close, isOpen, open } = useModal();
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const title = titleRef.current?.value;
    const description = descriptionRef.current?.value;

    if (!title || !description) {
      return;
    }

    mutate({ title, description });

    console.log(title, description);
    close();
  };

  return (
    <div>
      <button
        className="border border-dashed rounded-lg px-5 py-2 bg-slate-80"
        onClick={open}
      >
        + New Category
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-black">
          <div className="bg-white p-6 rounded">
            <h2 className="text-2xl">New Category</h2>
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
