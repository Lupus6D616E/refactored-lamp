
import React from 'react';
import ItemsList from '@components/dashboard/info/experiencelist';
const ExperienceList = () => {
type Item = {
  id: number;
  position: string;
  experience:string;
};
  const [items, setItems] = React.useState<Item[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/getexperience', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setItems(data.items))
      .finally(() => setLoading(false));
  }, []);


  const handleItemDeleted = (deletedId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== deletedId));
  };

  if (loading) return <span className="loading loading-spinner loading-lg"></span>;

  return <ItemsList items={items} onDelete={handleItemDeleted} />;
};
export default ExperienceList;