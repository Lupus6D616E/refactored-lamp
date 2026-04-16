import { edenTreatyApi } from "@lib/eden";
import React, { useEffect, useState } from "react";

interface Article {
    title: string;
    body: string;
    image: Blob;
}

interface ArticleWithUrl {
    title: string;
    body: string;
    imageUrl: string;
}

const ArticlesPage: React.FC = () => {
    const [articles, setArticles] = useState<ArticleWithUrl[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1)
    const [inputPage, setInputPage] = useState(1)
    const [totalpages, setTotalPages] = useState(0)
    useEffect(() => {
        const fetchTotalPages = async () => {
            try {
                const response = await edenTreatyApi.news.pages.total.get()
                if(response.data){
                    setTotalPages(response.data)
                }
            }
            catch
            (err) {
                console.error("Failed to fetch pages somehow:", err);
            }
        }
        fetchTotalPages()
    }, [])
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await edenTreatyApi.news.page({ number: page }).get()
                if (response.data) {
                    const transformed = response.data.map((article) => ({
                        title: article.title,
                        body: article.body,
                        imageUrl: article.imageUrl ?? "/public/images/doge.jpg"
                    }))
                    setArticles(transformed)
                }
                else {
                    throw new Error("failed to set articles")
                }
            } catch (err) {
                console.error("Failed to fetch articles:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();

        // Cleanup object URLs
        return () => {
            articles.forEach((a) => URL.revokeObjectURL(a.imageUrl));
        };
    }, [page]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }
    function handleIncreasePage(){
        setPage(page+1)
    }

    function handleDecreasePage(){
        setPage(page-1)
    }

    function goToPage(){
        setPage(inputPage)
    }
    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold mb-4">Articles</h1>

            {articles.map((article, index) => (
                <div key={index} className="card bg-base-100 shadow-xl">
                    <figure>
                        <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-64 object-cover"
                        />
                    </figure>

                    <div className="card-body">
                        <h2 className="card-title">{article.title}</h2>
                        <p className="text-sm opacity-80 whitespace-pre-line">
                            {article.body}
                        </p>
                    </div>
                </div>
            ))}

            <button className="btn" disabled={page === 1} onClick={handleDecreasePage} >prev page</button>
            <button className="btn" disabled={page >= totalpages}onClick={handleIncreasePage}>next page</button>
            <input
  type="number"
  className="input validator"
  required
  placeholder={`must be between 1 and ${totalpages}`}
  min="1"
  value={inputPage}
  onChange={(e) => setInputPage(parseInt(e.target.value))}
  max={totalpages}
  title={`must be between 1 and ${totalpages}`}
/>
<p className="validator-hint">Must be between 1 to {totalpages}</p>
            <button onClick={goToPage} className="btn">go to page </button>
            current page: {page}
        </div>

    );

};

export default ArticlesPage;