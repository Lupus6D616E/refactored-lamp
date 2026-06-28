import { edenTreatyApi } from "@lib/eden";
import { useEffect, useState } from "react";


interface Item {
  id: number
  businessName: string
  userName: string | null
  email: string | null
  status: string
}


interface businessInfo {
  id: number;
  userName: string | null
  businessName: string;
  description: string;
  address: string;
  email: string | null
  industry: string;
  status: string;
  bin: string;
}

interface Pagination {
  page: number;
  totalPages: number;
  totalApplications: number;
}


interface ChildProps {
  businessInfo: businessInfo;
  setBusinessInfo: React.Dispatch<React.SetStateAction<businessInfo>>;
}

export const PendingVerificationList: React.FC<ChildProps> = ({ businessInfo, setBusinessInfo }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [selectedType, setSelectedType] = useState<string>("pending")
  const fetchItems = async (newPage: number, type:string) => {

    try {
      setLoading(true)
      const res = await edenTreatyApi.verify.admin.listpendingverification.get({ query: { page: newPage, type:type } })
      if (!res.data) throw new Error("Failed to fetch");
      const data: Item[] = res.data.applications
      setPagination(res.data.pagination || null);
      setCurrentPage(res.data.pagination.page)
      setItems(data);
      console.log(data)
    } catch (err) {
      setError("Could not load items");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchItems(1,selectedType);
  }, []);

  async function updatePreview(id: number) {
    const res = await edenTreatyApi.verify.admin.verification({ id: id }).get()
    if (res.data === null) {
      throw new Error("data error idk man")
    }
    setBusinessInfo(prev => ({
      ...prev,
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

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (pagination && newPage > pagination.totalPages)) return;
    fetchItems(newPage,selectedType);
  };
  const handleSelectChange = (newSelect: string) =>{
    setSelectedType(newSelect)
    setCurrentPage(1)
    fetchItems(1,newSelect)
  }

  return (
    <div className="card bg-base-150 shadow-xl">
      <div className="card-body">

        <h2 className="card-title">Page {currentPage}, selected type: {selectedType}</h2>
        <div className="p-4 border-b border-base-300 bg-base-200">
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="btn btn-sm btn-outline flex-1"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination || currentPage === pagination.totalPages || loading}
              className="btn btn-sm btn-outline flex-1"
            >
              Next
            </button>
          </div>
          <select
            value={selectedType}
            onChange={(e) => handleSelectChange(e.target.value)}
            className="select">
            <option value={"pending"}>Pending</option>
            <option value={"all"}>All</option>
          </select>

          {/* Page Input */}
          {pagination && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-sm text-base-content/70">Page</span>
              <input
                type="number"
                min={1}
                max={pagination.totalPages}
                value={currentPage}
                onChange={(e) => handlePageChange(parseInt(e.target.value))}
                className="input input-bordered input-sm w-20 text-center"
              />
              <span className="text-sm text-base-content/70">
                of {pagination.totalPages}
              </span>
            </div>
          )}
        </div>

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
                    <button className="btn btn-primary btn-lg" onClick={() => updatePreview(item.id)}>View application</button>
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
