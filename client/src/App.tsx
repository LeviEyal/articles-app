import "./App.css";
import { ArticlesList } from "./components/ArticlesList";
import {
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import { ArticlePage } from "./components/ArticlePage";
import { NewCategoryModal } from "./components/NewCategoryModal";
import { useCategories } from "./hooks/useCategories";
import { Header } from "./components/Header";

const LinkItem = ({
  to,
  title,
  isActive,
}: {
  to: string;
  title: string;
  isActive: boolean;
}) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-5 h-14 cursor-pointer capitalize ${
        isActive
          ? "font-bold bg-blue-300 text-gray-700 shadow"
          : "hover:bg-blue-300/30"
      }`}
    >
      {title}
    </Link>
  );
};

/**
 * Renders the layout of the application.
 *
 * @returns The layout component.
 */
export const AppLayout = () => {
  const { category: currentCategory } = useParams() as { category: string };
  const { categories } = useCategories();

  return (
    <div className="flex">
      <menu className="w-72 h-screen bg-gray-600 text-white sticky top-0 text-xl flex flex-col items-center">
        <img
          src="https://fire-arc.com/wp-content/uploads/2022/06/FireArc-Logo-White.png"
          width={180}
          className="m-3"
          alt="Logo"
        />
        {categories && (
          <div className="space-y-3 w-full m-10">
            <LinkItem
              to={`/articles`}
              title={"All"}
              isActive={!currentCategory}
            />
            {categories.map((category) => (
              <LinkItem
                key={category.id}
                to={`/articles/${category.id}`}
                title={category.title}
                isActive={category.id === currentCategory}
              />
            ))}
          </div>
        )}
        <NewCategoryModal />
      </menu>
      <main className="flex-1">
        <Header />
        <Outlet />
      </main>
    </div>
  );
};

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/articles" />} />
        <Route path="articles/:category/:id" element={<ArticlePage />} />
        <Route path="articles/:category" element={<ArticlesList />} />
        <Route path="articles/*" element={<ArticlesList />} />
      </Route>
    </Routes>
  );
};
