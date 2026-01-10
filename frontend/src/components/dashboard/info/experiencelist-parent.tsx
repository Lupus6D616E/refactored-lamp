import React from "react";
import ItemsList from "frontend/src/components/dashboard/info/experiencelist";
const ExperienceList = () => {
  type Item = {
    id: number;
    position: string;
    experience: string;
  };
  const [items, setItems] = React.useState<Item[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getexperience = async () => {
      try {
        const res = await fetch("/user/getexperience", {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`something happened ${res.status}`);
        }
        const data = await res.json();
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
