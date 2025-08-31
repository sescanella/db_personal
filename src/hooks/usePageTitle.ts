import { useEffect } from 'react';

interface UsePageTitleOptions {
  suffix?: string;
  prefix?: string;
}

export function usePageTitle(title: string, options: UsePageTitleOptions = {}) {
  const { suffix = 'BD del Personal', prefix } = options;

  useEffect(() => {
    const fullTitle = [prefix, title, suffix].filter(Boolean).join(' | ');
    document.title = fullTitle;
    
    // Cleanup - reset to default title when component unmounts
    return () => {
      document.title = 'BD del Personal';
    };
  }, [title, suffix, prefix]);
}