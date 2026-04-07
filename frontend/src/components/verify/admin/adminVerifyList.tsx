import { edenTreatyApi } from "@lib/eden";
import { useEffect, useState } from "react";


interface Item {
id:number
businessName: string
userName: string|null
email: string|null
status: string
}


interface businessInfo {
    id: number;
    userName: string | null
    businessName: string;
    description: string;
    address: string;
    email: string| null
    industry: string;
    status: string;
    bin: string;
}

interface ChildProps {
  businessInfo: businessInfo;
  setBusinessInfo: React.Dispatch<React.SetStateAction<businessInfo>>;
}

export const PendingVerificationList: React.FC<ChildProps> = ({businessInfo, setBusinessInfo}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await edenTreatyApi.verify.admin.listpendingverification.get()
        if (!res.data) throw new Error("Failed to fetch");
        const data: Item[] = res.data
        setItems(data);
        console.log(data)
      } catch (err) {
        setError("Could not load items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  async function updatePreview(id: number){
    const res = await edenTreatyApi.verify.admin.verification({id: id}).get()
    if(res.data === null){
      throw new Error("data error idk man")
    }
    setBusinessInfo(prev => ({ ...prev,
       id: res.data.id,
       businessName: res.data.businessName,
       userName: res.data.userName,
       description: res.data.description,
       address: res.data.address,
       email: res.data.email,
       industry: res.data.industry,
       status: res.data.status,
       bin: res.data.bin
      }));
  };

  return (
    <div className="card bg-base-150 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Items</h2>

        {loading && <span className="loading loading-spinner" />}
        {error && <p className="text-error">{error}</p>}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="card bg-base-200">
              <div className="card-body p-4">
                <h2>{item.userName}</h2>
               <h2>{item.email}</h2>
                <h3 className="font-semibold">
                  status: {item.status}
                </h3>

                <div className="flex justify-between items-center">        
                  <span className="text-sm opacity-70">
                     <button className="btn btn-primary btn-lg"  onClick={() => updatePreview(item.id)}>View application</button>
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
