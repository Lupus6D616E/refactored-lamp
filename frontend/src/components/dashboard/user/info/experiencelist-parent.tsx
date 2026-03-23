import React from "react";
import ItemsList from "@components/dashboard/user/info/experiencelist";
import { edenTreatyApi } from "@lib/eden";
const ExperienceList = () => {
  type Item = {
    id: number;
    position: string;
    experience: string;
    duration: string;
  };
  const [items, setItems] = React.useState<Item[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getexperience = async () => {
      try {
        const response = await edenTreatyApi.user.getexperience.get()

        if (!response.data) {
          throw new Error(`something happened ${response.status}`);
        }
        const data = response.data;
        setItems(data.items); 
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setLoading(false);
      }
    };
    getexperience();
  }, []);

  const handleItemDeleted = (deletedId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== deletedId));
  };

  if (loading)
    return <span className="loading loading-spinner loading-lg"></span>;

  return <ItemsList items={items} onDelete={handleItemDeleted} />;
};
export default ExperienceList;
