import React from 'react';




type Item = {
  id: number;
  certification:string;
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
      const response = await fetch(`/certifications/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
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
    <ul className="menu bg-base-200 rounded-box w-full max-w-md mx-auto">
      {items.map((item) => (
        <li key={item.id}>
          <a className="flex justify-between items-center active:opacity-80">
            <div>
              <span className="text-sm opacity-70 block">Certification: {item.certification}</span>
            </div>

            {/* Delete X Button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent menu item click if it's clickable
                handleDelete(item.id);
              }}
              disabled={deletingId === item.id}
              className="btn btn-ghost btn-circle btn-sm text-error"
              aria-label="Delete item"
            >
              {deletingId === item.id ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default ItemsList;