import { edenTreatyApi } from '@lib/eden';
import React from 'react';

type Item = {
  id: number;
  certification: string;
};

type ItemsListProps = {
  items: Item[];
  onDelete?: (deletedId: number) => void;
  showDelete?: boolean; // 👈 Idagdag ito para makontrol ang button
};

// Ginawa nating default na `true` ang showDelete para hindi masira ang dashboard.tsx mo
const ItemsList: React.FC<ItemsListProps> = ({ items, onDelete, showDelete = true }) => {
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const handleDelete = async (itemId: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    setDeletingId(itemId);

    try {
      const res = await edenTreatyApi.user.certifications({ id: itemId }).delete();

      if (res.status !== 200) {
        throw new Error('Failed to delete');
      }
      onDelete?.(itemId);
    } catch (err) {
      alert('Error deleting item. Please try again.');
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  if (items.length === 0) {
    return <p className="text-center text-gray-500">No items found.</p>;
  }

  return (
    <div className="md:col-span-2 space-y-6">
      <div className="card bg-base-100 shadow-md p-6">
        <h3 className="font-bold border-b mb-3 pb-1 text-xs uppercase opacity-50 tracking-widest">
          Results / Certifications
        </h3>

        <div className="space-y-3">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-start group border-b border-base-200 last:border-0 pb-2 last:pb-0 transition-all duration-200 hover:bg-base-200 rounded-lg p-2 -mx-2"
              >
                <p className="text-sm leading-relaxed opacity-80 flex-1 break-all mr-2">
                  {item.certification}
                </p>

          {typeof window !== 'undefined' && !window.location.pathname.includes('profile') && (
              <button
                  onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
          }}
               disabled={deletingId === item.id}
               className="btn btn-ghost btn-xs text-error opacity-0 group-hover:opacity-100 transition-opacity"
               aria-label="Delete item"
            >
              {deletingId === item.id ? (
            <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
              </button>

                )}
              </div>
            ))
          ) : (
            <p className="text-sm italic opacity-50">No certifications listed.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemsList;