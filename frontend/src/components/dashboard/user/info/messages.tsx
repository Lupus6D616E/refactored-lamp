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
    <div className="card bg-base-150 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Items</h2>

        {loading && <span className="loading loading-spinner" />}
        {error && <p className="text-error">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.messageId} className="card bg-base-200">
              <div className="card-body p-4">
                <h2>{item.businessName}</h2>
                {item.senderRole !== "business" && <h2>{item.senderRole.toUpperCase()}</h2>}
                <h3 className="font-semibold">
                  Subject: {item.subject}
                </h3>

                <div className="flex justify-between items-center">        
                  <span className="text-sm opacity-70">
                     <a  className="btn btn-primary btn-lg" href={`viewmail.html?id=${item.messageId}`} > Go to post </a>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
