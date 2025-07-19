'use client';

import {{ useState, useEffect }} from 'react';

interface StockData {{
  stock: {{
    inner: number;
    shortSleeve: number;
    longSleeve: number;
    pants: number;
  }};
  toBring: {{
    inner: number;
    shortSleeve: number;
    longSleeve: number;
    pants: number;
  }};
}}

export default function HomePage() {{
  const [data, setData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {{
    async function fetchData() {{
      try {{
        const res = await fetch('/api/stock');
        if (!res.ok) {{
          throw new Error('データの取得に失敗しました。');
        }}
        const jsonData = await res.json();
        setData(jsonData);
      }} catch (err) {{
        setError(err instanceof Error ? err.message : String(err));
      }} finally {{
        setLoading(false);
      }}
    }}
    fetchData();
  }}, []);

  const renderTable = (title: string, items: StockData['stock'] | StockData['toBring']) => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{{title}}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">種類</th>
              <th className="py-2 px-4 border-b">枚数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b">肌着</td>
              <td className="py-2 px-4 border-b">{{items.inner}}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">上着 (半袖)</td>
              <td className="py-2 px-4 border-b">{{items.shortSleeve}}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">上着 (長袖)</td>
              <td className="py-2 px-4 border-b">{{items.longSleeve}}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">ズボン</td>
              <td className="py-2 px-4 border-b">{{items.pants}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-8">保育園着替え 在庫管理</h1>
      
      {loading && <p className="text-center">読み込み中...</p>}
      {error && <p className="text-center text-red-500">エラー: {{error}}</p>}
      
      {data && (
        <div>
          {renderTable('現在の保育園の在庫', data.stock)}
          {renderTable('明日持っていくもの', data.toBring)}
        </div>
      )}
    </main>
  );
}}