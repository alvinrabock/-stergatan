
export async function fetchPopularProducts(limit = 10, days = 14) {
    const url = `https://ostersifshop.se/export/popular/data.json?limit=${limit}&days=${days}`;
  
    try {
      const res = await fetch(url, {
        next: { revalidate: 21600 },
      });
  
      if (!res.ok) throw new Error("Failed to fetch popular products");
  
      return await res.json();
    } catch (error) {
      console.error("Error fetching popular products:", error);
      return [];
    }
  }
  