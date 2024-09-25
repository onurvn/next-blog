'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link';
import { posts } from "@/../data/posts"
import ThemeToggle from '@/components/theme-toggle';

const HomePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1); // Sayfalama için state
  const postsPerPage = 6; // Sayfa başına gösterilecek yazı sayısı

  useEffect(() => {
    if (selectedCategory) {
      router.push(`/?category=${selectedCategory}`);
    } else {
      router.push(`/`);
    }
  }, [selectedCategory, router]);

  const categories = Array.from(new Set(posts.map((post) => post.category)));

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sayfalama için gerekli hesaplamalar
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Blog </h1>
      <ThemeToggle mode="flex justify-end mb-2" />
      {/* Arama Çubuğu */}
      <div className="mb-8 text-center">
        <Input
          type="text"
          placeholder="Yazı başlığı ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded-lg  mb-4"
        />
      </div>

      {/* Kategori Filtreleme */}
      <div className="mb-8 text-center">
        <Button
          variant={"default"}
          onClick={() => setSelectedCategory(null)}
          className={"px-4 py-2 m-2 text-sm font-semibold"}
        >
          Tüm Kategoriler
        </Button>
        {categories.map((category) => (
          <Button
            variant={"default"}
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={"px-4 py-2 m-2 text-sm font-semibold"}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Blog Yazılarının Listelenmesi */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {currentPosts.map((post) => (
          <div key={post.id} className="border p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Link href={`/posts/${post.id}`}>
              <h2 className="text-2xl font-bold mb-2 cursor-pointer hover:underline">{post.title}</h2>
            </Link>
            <p className="text-gray-500 text-sm mb-4">Yazar: {post.author} | Tarih: {post.date}</p>
            <p className="text-gray-700 mb-4">{post.content.substring(0, 100)}...</p>
            <div>
              {post.tags.map((tag, index) => (
                <span key={index} className="inline-block bg-black text-white rounded-full px-3 py-1 text-xs font-semibold mr-2">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sayfalama Kontrolleri */}
      <div className="mt-8 text-center">
        {/* Önceki Sayfa */}
        <Button
          variant={"default"}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className={`px-4 py-2 mx-1 ${currentPage === 1 ? 'bg-gray-200 text-gray-500' : ''}`}
          disabled={currentPage === 1}
        >
          Önceki
        </Button>

        {/* Sayfa Numaraları */}
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            variant={"default"}
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 mx-1 ${currentPage === index + 1 ? '' : 'bg-gray-200 text-gray-700'}`}
          >
            {index + 1}
          </Button>
        ))}

        {/* Sonraki Sayfa */}
        <Button
          variant={'default'}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className={`px-4 py-2 mx-1 ${currentPage === totalPages ? 'bg-gray-200 text-gray-500' : ''}`}
          disabled={currentPage === totalPages}
        >
          Sonraki
        </Button>
      </div>

    </div>

  );
};

export default HomePage;
