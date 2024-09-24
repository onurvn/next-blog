"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // useParams kullanarak parametreleri alma
import { posts } from "@/../data/posts";
import Head from 'next/head';
import { Button } from "@/components/ui/button";
import { DiscussionEmbed } from 'disqus-react';
import Link from 'next/link';

const PostPage = () => {
  const { id } = useParams(); // useParams ile id'yi alma
  const [isDarkMode, setIsDarkMode] = useState(false);

  const post = posts.find((p) => p.id === parseInt(id as string)); // Id'ye göre yazıyı bulma

  if (!post) return <p>Yazı bulunamadı!</p>; // Eğer yazı yoksa mesaj göster

  const disqusConfig = {
    url: `http://localhost:3000/posts/${post.id}`,
    identifier: post.id.toString(),
    title: post.title,
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`container mx-auto p-4 ${isDarkMode ? 'dark' : ''}`}>
      <Head>
        <title>{post.title} | Blog</title>
        <meta name="description" content={post.content.substring(0, 160)} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content.substring(0, 160)} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`http://localhost:3000/posts/${post.id}`} />
      </Head>

      {/* Gece Modu Aç/Kapat Butonu */}
      <Button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="mt-4 p-2 bg-gray-800 text-white rounded flex ml-auto"
      >
        {isDarkMode ? 'Gündüz Moduna Geç' : 'Gece Moduna Geç'}
      </Button>
      
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-6">Yazar: {post.author} - {post.date}</p>
      <p>{post.content}</p>

      {/* Ana sayfaya dönüş butonu */}
      <Link href="/">
        <Button variant={"default"} className="mt-6 p-2 bg-black text-white rounded">
          Ana Sayfaya Dön
        </Button>
      </Link>

      {/* Disqus Yorum Bileşeni */}
      <div className={`mt-8 ${isDarkMode ? 'disqus-dark' : ''}`}>
        <DiscussionEmbed shortname={process.env.NEXT_PUBLIC_DISQUS_SHORTNAME as string} config={disqusConfig} />
      </div>
    </div>
  );
};

export default PostPage;
