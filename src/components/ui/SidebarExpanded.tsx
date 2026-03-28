import { menuItems } from './SidebarData';

const SidebarExpanded = ({ role }: { role?: string }) => {
  const filteredItems = menuItems.filter(item => {
    if (item.name === 'User' && role !== 'Admin') return false;
    return true;
  });

  return (
    <aside
      className="fixed left-0 top-0 z-40 h-screen transition-all duration-300 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 -translate-x-full sm:translate-x-0"
      style={{ width: 'var(--sidebar-width)' }}
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 pt-20">
        <ul className="space-y-2 font-medium">
          {filteredItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group transition-colors duration-200"
              >
                <span className="text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                  {item.icon}
                </span>
                <span className="ms-3 transition-opacity duration-300">
                  {item.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default SidebarExpanded;
