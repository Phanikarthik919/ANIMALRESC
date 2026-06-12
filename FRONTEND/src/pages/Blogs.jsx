import React from 'react';
import {
  articleGrid,
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  readMoreBtn,
  sectionTitle,
  bodyText,
} from '../styles/common';

const Blogs = () => {
  const posts = [
    { id: 1, title: 'The Importance of Sterilization', date: 'Oct 12, 2024', summary: 'Controlling the population of stray animals through humane sterilization and vaccination drives prevents the spread of diseases.', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800' },
    { id: 2, title: 'Max’s Journey: From the Streets to a Loving Home', date: 'Sep 28, 2024', summary: 'Read the heartwarming success story of Max, a stray dog found with a broken leg, who is now fully recovered and living with his forever family.', image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800' },
    { id: 3, title: 'How to Be a Compassionate Pet Owner', date: 'Sep 10, 2024', summary: 'Bringing a pet home is a huge responsibility. Here are top tips for ensuring your newly adopted rescue feels safe and loved.', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800' }
  ];

  return (
    <div className="px-4 py-8 sm:px-0 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className={sectionTitle}>News & Success Stories</h2>
        <p className={bodyText + " text-lg max-w-2xl mx-auto"}>Stay updated with our latest rescues, educational articles, and heartwarming tales of animals finding their forever homes.</p>
      </div>

      <div className={articleGrid}>
        {posts.map(post => (
          <div key={post.id} className={articleCardClass}>
            <img src={post.image} alt="blog cover" className="h-48 w-full object-cover" />
            <div className="p-6 flex flex-col flex-grow">
              <span className={articleMeta}>{post.date}</span>
              <h3 className={articleTitle}>{post.title}</h3>
              <p className={articleExcerpt}>{post.summary}</p>
              <button className={readMoreBtn}>
                Read More <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
