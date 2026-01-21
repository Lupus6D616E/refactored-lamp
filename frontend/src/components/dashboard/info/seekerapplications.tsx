import { edenApi } from "@lib/eden";
import { useEffect, useState } from "react";

type CardStatus = "pending" | "rejected" | "accepted" | "expired";

interface Item {
  jobId: number;
  title: string;
  status: CardStatus;
}

export function ApplicationList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await edenApi.user.viewapplications.get(); // backend not important
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

  const statusBadge = (status: CardStatus) => {
    switch (status) {

      case "pending":
        return "badge-info";
      case "accepted":
        return "badge-success";
      case "rejected":
        return "badge-error";
      case "expired":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  return (
    <div className="card bg-base-150 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Items</h2>

        {loading && <span className="loading loading-spinner" />}
        {error && <p className="text-error">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.jobId} className="card bg-base-200">
              <div className="card-body p-4">
                <h3 className="font-semibold">
                  Title: {item.title}
                </h3>

                <div className="flex justify-between items-center">
                  <span
                    className={`badge ${statusBadge(item.status)}`}
                  >
                    {item.status}
                  </span>
                  <span className="text-sm opacity-70">
                     <a  className="btn btn-primary btn-lg" href={`viewpost.html?id=${item.jobId}`} > Go to post </a>
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
