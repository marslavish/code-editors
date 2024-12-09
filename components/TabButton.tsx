interface TabButtonProps {
  label: string;
  tabId: string;
  activeTab: string;
  onClick: () => void;
}

export function TabButton({ label, tabId, activeTab, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 min-w-[120px] font-medium text-gray-500 transition-all border-2 ${
        activeTab === tabId
          ? 'bg-white shadow-sm rounded-t-lg text-gray-900 border-gray-300 border-b-white relative top-[2px] z-10'
          : 'bg-gray-100 hover:bg-gray-200 rounded-t-lg border-transparent'
      }`}
    >
      {label}
    </button>
  );
}
