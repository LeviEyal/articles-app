/**
 * Renders a breadcrumb navigation component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string[]} props.paths - The array of paths to be displayed as breadcrumbs.
 * @returns {JSX.Element} The rendered BreadCrumbs component.
 */
export const BreadCrumbs = ({ paths }: { paths: string[] }) => {
  return (
    <div className="flex gap-2 text-xl">
      {paths.map((path, index) => (
        <span key={path}>
          {path}
          {index !== paths.length - 1 && " > "}
        </span>
      ))}
    </div>
  );
};
