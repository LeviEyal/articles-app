import { NavLink } from "react-router-dom";
import useReactRouterBreadcrumbs from "use-react-router-breadcrumbs";

/**
 * Represents the header component of the application.
 * Renders a sticky header with breadcrumbs.
 */
export const Header = () => {
  const breadcrumbs = useReactRouterBreadcrumbs();

  return (
    <header
      className="w-full px-5 h-14 sticky top-0
        backdrop-blur-md flex items-center justify-between text-white/90 text-2xl
        bg-gray-800 shadow
    "
    >
      <div className="flex gap-2">
        {breadcrumbs.map(({ match, breadcrumb }) => (
          <NavLink key={match.pathname} to={match.pathname}>
            / {breadcrumb}
          </NavLink>
        ))}
      </div>
    </header>
  );
};
