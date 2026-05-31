import React from 'react';

const Blogs = () => {
  const posts = [
    { id: 1, title: 'The Importance of Sterilization', date: 'Oct 12, 2024', summary: 'Controlling the population of stray animals through humane sterilization and vaccination drives prevents the spread of diseases.', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800' },
    { id: 2, title: 'Max’s Journey: From the Streets to a Loving Home', date: 'Sep 28, 2024', summary: 'Read the heartwarming success story of Max, a stray dog found with a broken leg, who is now fully recovered and living with his forever family.', image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800' },
    { id: 3, title: 'How to Be a Compassionate Pet Owner', date: 'Sep 10, 2024', summary: 'Bringing a pet home is a huge responsibility. Here are top tips for ensuring your newly adopted rescue feels safe and loved.', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800' }
  ];

  return (
    <div className="px-4 py-8 sm:px-0 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-brand-darkGrey mb-4">News & Success Stories</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Stay updated with our latest rescues, educational articles, and heartwarming tales of animals finding their forever homes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <img src={post.image} alt="blog cover" className="h-48 w-full object-cover" />
            <div className="p-6 flex flex-col flex-grow">
              <span className="text-brand-primary text-xs font-bold uppercase tracking-wider mb-2">{post.date}</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
              <p className="text-gray-600 mb-6 flex-grow">{post.summary}</p>
              <button className="text-brand-primary font-bold hover:text-brand-primaryDark transition flex items-center">
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
