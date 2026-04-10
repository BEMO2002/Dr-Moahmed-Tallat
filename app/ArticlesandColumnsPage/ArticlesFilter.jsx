"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const ArticlesFilter = ({ isRTL }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isFeatured = searchParams.get('is_featured') === '1';
  const isOldValue = searchParams.get('is_old');
  const isOld = isOldValue === '1';
  const isNew = isOldValue === '0';

  const handleFilter = (filterType) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Clear all filters first
    params.delete('is_featured');
    params.delete('is_old');

    if (filterType === 'featured') {
      params.set('is_featured', '1');
    } else if (filterType === 'old') {
      params.set('is_old', '1');
    } else if (filterType === 'new') {
      params.set('is_old', '0');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={`flex flex-wrap items-center gap-4 mb-10 ${isRTL ? 'flex-row' : ''}`}>
      <button 
        onClick={() => handleFilter('all')}
        className={`px-6 py-2.5 rounded-full font-black text-sm uppercase tracking-widest transition-all ${
          !isFeatured && isOldValue === null 
            ? 'bg-primary text-white shadow-xl translate-y-[-2px]' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        {isRTL ? 'الكل' : 'All'}
      </button>
      
      <button 
        onClick={() => handleFilter('new')}
        className={`px-6 py-2.5 rounded-full font-black text-sm uppercase tracking-widest transition-all ${
          isNew 
            ? 'bg-blue-600 text-white shadow-xl translate-y-[-2px]' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        {isRTL ? 'مقالات حديثة' : 'Recent'}
      </button>

      <button 
        onClick={() => handleFilter('old')}
        className={`px-6 py-2.5 rounded-full font-black text-sm uppercase tracking-widest transition-all ${
          isOld 
            ? 'bg-amber-600 text-white shadow-xl translate-y-[-2px]' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        {isRTL ? 'مقالات قديمة' : 'Old Articles'}
      </button>

      <button 
        onClick={() => handleFilter('featured')}
        className={`px-6 py-2.5 rounded-full font-black text-sm uppercase tracking-widest transition-all ${
          isFeatured 
            ? 'bg-green-600 text-white shadow-xl translate-y-[-2px]' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        {isRTL ? 'مقالات مميزة' : 'Featured'}
      </button>
    </div>
  );
};

export default ArticlesFilter;
