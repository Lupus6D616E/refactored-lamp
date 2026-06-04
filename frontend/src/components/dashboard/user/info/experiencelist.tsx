import { edenTreatyApi } from '@lib/eden';
import React from 'react';

type Item = {
  id: number;
  experience:string;
  position:string;
  duration:string;
};

type ItemsListProps = {
  items: Item[];
  onDelete?: (deletedId: number) => void;
};

const ItemsList: React.FC<ItemsListProps> = ({ items, onDelete }) => {
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const handleDelete = async (itemId: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    setDeletingId(itemId);

    try {

      const res = await edenTreatyApi.user.workexperience({id: itemId}).delete()
    
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
  <div className="card bg-base-100 shadow-md p-8 transition-all duration-300 hover:shadow-lg">
    {/* HEADER STYLE KAGAYA NG DESCRIPTION */}
    <h3 className="font-bold border-b mb-4 pb-1 text-xs uppercase opacity-50 tracking-widest">
      Experience
    </h3>

    <div className="space-y-6">
      {items.length > 0 ? (
        items.map((item) => (
          <div 
            key={item.id} 
            className="group relative flex justify-between items-start border-b border-base-100 last:border-0 pb-4 last:pb-0"
          >
            {/* TEXT CONTENT: Dito natin ilalagay ang break-all para kusa mag-next line */}
            <div className="flex-1 break-all whitespace-pre-wrap pr-8">
              <div className="space-y-1">
                <p className="text-sm font-semibold opacity-90">
                  <span className="opacity-50 uppercase text-[10px] tracking-wider block">Experience:</span>
                  {item.experience}
                </p>
                <p className="text-sm opacity-80">
                  <span className="opacity-50 uppercase text-[10px] tracking-wider block">Position:</span>
                  {item.position}
                </p>
                <p className="text-[11px] opacity-60 italic">
                  {item.duration}
                </p>
              </div>
            </div>

            {/* DELETE BUTTON: Lalabas lang pag na-hover (parang description edit style) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item.id);
              }}
              disabled={deletingId === item.id}
              className="btn btn-ghost btn-circle btn-sm text-error opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
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
          </div>
        ))
      ) : (
        <p className="text-sm italic opacity-50">No experience listed.</p>
      )}
    </div>
  </div>
</div>
  );
};

export default ItemsList;