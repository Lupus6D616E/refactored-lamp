import { edenTreatyApi } from "@lib/eden";
import { useEffect, useState } from "react";


interface Item {
  messageId: number;
  businessName: string|null
  subject: string;
  message: string |null;
  date: Date;
  senderRole: string;
}

export function MessageList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await edenTreatyApi.message.usermymessages.get()
        if (!res.data) throw new Error("Failed to fetch");
        const data: Item[] = res.data
        setItems(data);
      } catch (err) {
        setError("Could not load items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);


  return (
    <div className="card bg-base-100 shadow-md p-6 border border-base-200">
  {/* Main Header Style - Ginaya sa General Info at Work Experience */}
  <h3 className="font-bold border-b mb-4 pb-1 text-xs uppercase opacity-50 tracking-widest">
    Messages
  </h3>

  {/* Status & Loading States */}
  {loading && (
    <div className="flex justify-center py-4">
      <span className="loading loading-spinner loading-md text-primary" />
    </div>
  )}
  {error && (
    <div className="p-2 mb-4 rounded-md bg-error/10 text-error text-xs text-center font-medium border border-error/20">
      {error}
    </div>
  )}

  {/* Main Content List Container */}
  <div className="flex flex-col gap-3">
    {items.length > 0 ? (
      items.map((item) => (
        <div 
          key={item.messageId} 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-base-200/30 p-3 rounded-lg border border-base-200/50 hover:bg-base-200/80 transition-all gap-3"
        >
          {/* Left Side: Information Details */}
          <div className="space-y-1 w-full sm:w-auto">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Business Name */}
              <span className="text-sm font-bold tracking-tight">
                {item.businessName}
              </span>

              {/* Sender Role Badge - Magpapakita lang kung hindi "business" */}
              {item.senderRole !== "business" && (
                <span className="badge badge-secondary badge-outline text-[10px] font-bold tracking-wide px-2 py-0.5 h-auto">
                  {item.senderRole.toUpperCase()}
                </span>
              )}
            </div>

            {/* Subject */}
            <p className="text-xs opacity-70">
              <span className="font-semibold opacity-50">Subject:</span> {item.subject}
            </p>
          </div>

          {/* Right Side: Action Link Button */}
          <div className="w-full sm:w-auto text-right">
            <a 
              className="btn btn-primary btn-sm w-full sm:w-auto font-bold uppercase text-[11px] transition-transform active:scale-95" 
              href={`viewmail.html?id=${item.messageId}`}
            >
              Go to post
            </a>
          </div>
        </div>
      ))
    ) : (
      /* Fallback block kapag walang items - Kahalintulad ng "No skills listed" nung una */
      !loading && <p className="text-xs opacity-50 italic text-center py-2">No items found</p>
    )}
  </div>
</div>
  );
}
