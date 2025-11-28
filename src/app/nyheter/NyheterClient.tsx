'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import NyheterItem from '@/app/components/Nyheter/nyheterItem';
import MaxWidthWrapper from '@/app/components/MaxWidthWrapper';
import { Category, Post } from '@/types';
import CategorySidebar from '@/app/components/Nyheter/CategorySidebar';
import { Media } from '@/app/components/Media/index';
import { Button } from '../components/ui/Button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import Link from 'next/link';

// --- Skeleton component for loading state ---
const NyheterItemSkeleton = () => (
    <div className="animate-pulse group">
        <div className="relative w-full aspect-16/9 mb-4 bg-gray-500 rounded-md" />
        <p className="h-4 bg-gray-500 rounded w-24 mb-2" />
        <div className="h-6 bg-gray-500 rounded w-3/4" />
    </div>
);

type NewsPageClientProps = {
    posts: Post[];
    categories: Category[];
    selectedSlug?: string | null;
    currentCategory?: Category | null;
};

type CategoryNode = Category & {
    children: CategoryNode[];
    level: number;
};

// Memoized category tree builder
const buildCategoryTree = (categories: (string | Category)[]): CategoryNode[] => {
    const map = new Map<string, CategoryNode>();
    const roots: CategoryNode[] = [];

    const validCategories = categories.filter((cat): cat is Category =>
        typeof cat === 'object' && cat !== null && !!cat.id && !!cat.title
    );

    // First pass: create all nodes
    for (const cat of validCategories) {
        map.set(cat.id, { ...cat, children: [], level: 0 });
    }

    // Second pass: build hierarchy
    for (const cat of validCategories) {
        const node = map.get(cat.id)!;
        if (cat.parent && typeof cat.parent !== 'string' && cat.parent.id) {
            const parentNode = map.get(cat.parent.id);
            if (parentNode) {
                node.level = parentNode.level + 1;
                parentNode.children.push(node);
            }
        } else {
            roots.push(node);
        }
    }

    return roots;
};

export default function NewsPageClient({
    posts: initialPosts,
    categories,
    selectedSlug,
    currentCategory,
}: NewsPageClientProps) {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [posts, setPosts] = useState(initialPosts);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(initialPosts.length === 10);
    const [currentPage, setCurrentPage] = useState(1);

    // Memoize category tree to avoid rebuilding on every render
    const categoryTree = useMemo(() => buildCategoryTree(categories), [categories]);

    // Memoize existing post IDs for duplicate checking
    const existingPostIds = useMemo(() => new Set(posts.map(post => post.id)), [posts]);

    // Reset posts and pagination when category changes
    useEffect(() => {
        setPosts(initialPosts);
        setCurrentPage(1);
        setHasMore(initialPosts.length === 10);
    }, [initialPosts, currentCategory]);

    // Memoize parent ID finding logic
    const parentIds = useMemo(() => {
        if (!selectedSlug) return [];

        const findParentIds = (categories: CategoryNode[], slug: string): string[] => {
            const ids: string[] = [];
            const visited = new Set<string>();

            const findRecursively = (nodes: CategoryNode[]): boolean => {
                for (const node of nodes) {
                    if (visited.has(node.id)) continue;
                    visited.add(node.id);

                    if (node.slug === slug) {
                        ids.push(node.id);
                        return true;
                    }

                    if (node.children && findRecursively(node.children)) {
                        ids.push(node.id);
                        return true;
                    }
                }
                return false;
            };

            findRecursively(categories);
            return ids.reverse();
        };

        return findParentIds(categoryTree, selectedSlug);
    }, [categoryTree, selectedSlug]);

    useEffect(() => {
        setExpandedCategories(new Set(parentIds));
    }, [parentIds]);

    const toggleExpanded = useCallback((id: string) => {
        setExpandedCategories((prev) => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(id)) {
                newExpanded.delete(id);
            } else {
                newExpanded.add(id);
            }
            return newExpanded;
        });
    }, []);

    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);
        const nextPage = currentPage + 1;

        try {
            const url = new URL('/api/nyheter/list', window.location.origin);
            url.searchParams.set('limit', '10');
            url.searchParams.set('page', nextPage.toString());
            if (currentCategory?.slug) {
                url.searchParams.set('category', currentCategory.slug);
            }

            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }

            const data = await response.json();
            const newPosts = data.posts;

            if (!newPosts?.length) {
                setHasMore(false);
                return;
            }

            // Efficiently filter duplicates using the memoized Set
            const uniqueNewPosts = newPosts.filter((post: Post) => !existingPostIds.has(post.id));

            if (uniqueNewPosts.length > 0) {
                setPosts(prev => [...prev, ...uniqueNewPosts]);
            }

            setCurrentPage(nextPage);

            if (newPosts.length < 10) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Failed to load more posts:', error);
        } finally {
            setLoadingMore(false);
        }
    }, [loadingMore, currentCategory, hasMore, currentPage, existingPostIds]);

    const handleScroll = useCallback(() => {
        if (loadingMore || !hasMore) return;

        const { scrollY, innerHeight } = window;
        const { scrollHeight } = document.documentElement;
        const scrollPercentage = (scrollY + innerHeight) / scrollHeight;

        // Trigger much earlier - when user is 50% through the content
        if (scrollPercentage >= 0.5) {
            loadMore();
        }
    }, [loadingMore, hasMore, loadMore]);

    useEffect(() => {
        let timeoutId: number | null = null;

        const throttledScroll = () => {
            if (timeoutId) return;
            
            timeoutId = window.setTimeout(() => {
                handleScroll();
                timeoutId = null;
            }, 50);
        };

        // Check immediately on mount to see if we need more content
        const checkInitialLoad = () => {
            const { innerHeight } = window;
            const { scrollHeight } = document.documentElement;
            
            // If content doesn't fill the screen, load more immediately
            if (scrollHeight <= innerHeight * 1.5 && hasMore && !loadingMore) {
                loadMore();
            }
        };

        // Check on mount and after a short delay
        checkInitialLoad();
        setTimeout(checkInitialLoad, 100);

        window.addEventListener('scroll', throttledScroll, { passive: true });
        
        return () => {
            window.removeEventListener('scroll', throttledScroll);
            if (timeoutId) window.clearTimeout(timeoutId);
        };
    }, [handleScroll, hasMore, loadingMore, loadMore]);

    // Separate effect for checking content after category changes
    useEffect(() => {
        const checkContentAfterCategoryChange = () => {
            const { innerHeight } = window;
            const { scrollHeight } = document.documentElement;
            
            if (scrollHeight <= innerHeight * 1.5 && hasMore && !loadingMore) {
                loadMore();
            }
        };

        // Small delay to ensure DOM has updated after category change
        const timeoutId = setTimeout(checkContentAfterCategoryChange, 300);
        
        return () => clearTimeout(timeoutId);
    }, [currentCategory, hasMore, loadingMore, loadMore]);

    // Memoize breadcrumbs to avoid recalculation
    const breadcrumbs = useMemo(() => currentCategory?.breadcrumbs || [], [currentCategory]);

    return (
        <div className="w-full py-40 bg-custom_dark_dark_red">
            <MaxWidthWrapper>
                <div className="w-full mb-4">
                    {currentCategory?.banner ? (
                        <>
                            <div className="relative w-full h-[30svh] md:h-[50svh] rounded-md overflow-hidden">
                                <Media resource={currentCategory.banner} fill imgClassName="object-cover w-full h-full" />
                                <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-custom_dark_blue/70 via-transparent to-transparent" />
                                <div className="hidden md:block absolute bottom-8 left-8 text-left">
                                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{currentCategory.title}</h1>
                                    {currentCategory.description && (
                                        <p className="text-lg md:text-xl text-gray-100 max-w-2xl">{currentCategory.description}</p>
                                    )}
                                </div>
                            </div>
                            <div className="block md:hidden mt-4 text-center px-4">
                                <h1 className="text-4xl font-bold mb-2 text-white">{currentCategory.title}</h1>
                                {currentCategory.description && (
                                    <p className="text-lg text-gray-600 max-w-2xl mx-auto text-white">{currentCategory.description}</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col justify-center items-start text-left w-full text-white border-b border-white/40 pb-6">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                {currentCategory ? currentCategory.title : 'Nyheter från Öster'}
                            </h1>
                            {currentCategory?.description && (
                                <p className="text-lg text-gray-400 max-w-2xl">{currentCategory.description}</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-7 gap-10 text-white">
                    <div className="hidden col-span1 xl:block col-span-2 p-4 border border-white rounded-lg">
                        <div className="sticky top-36">
                            <CategorySidebar
                                categories={categoryTree}
                                selectedSlug={selectedSlug ?? null}
                                expandedCategories={expandedCategories}
                                toggleExpanded={toggleExpanded}
                                currentCategory={currentCategory ?? null}
                            />
                        </div>
                    </div>

                    <div className="col-span-5">
                        {/* Mobile Category Drawer */}
                        <div className="block xl:hidden mb-6">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full">
                                        Välj kategori
                                    </Button>
                                </DialogTrigger>

                                <DialogContent className="w-screen h-[100svh] md:max-w-5xl md:h-[60svh] max-w-none max-h-none bg-custom_dark_dark_red border-none flex flex-col p-0">
                                    <DialogHeader className="relative p-4">
                                        <DialogTitle className="text-white text-left">Kategorier</DialogTitle>
                                        <DialogClose asChild>
                                            <button
                                                className="absolute right-4 top-4 text-white text-sm font-medium hover:underline"
                                                aria-label="Stäng"
                                            >
                                                Stäng X
                                            </button>
                                        </DialogClose>
                                    </DialogHeader>

                                    <div className="flex-1 overflow-y-auto px-4 pb-4">
                                        <CategorySidebar
                                            categories={categoryTree}
                                            selectedSlug={selectedSlug ?? null}
                                            expandedCategories={expandedCategories}
                                            toggleExpanded={toggleExpanded}
                                            currentCategory={currentCategory ?? null}
                                        />
                                    </div>

                                    <DialogFooter className="p-4 border-t border-white/10">
                                        <DialogClose asChild>
                                            <Button variant="default" className="w-full">
                                                Visa resultat
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {breadcrumbs.length > 0 && (
                            <nav className="mb-4 text-sm text-white/70">
                                <ol className="flex flex-wrap items-center gap-2">
                                    {breadcrumbs.map((crumb, index) => (
                                        <li key={crumb.id} className="flex items-center gap-2">
                                            <Link href={crumb.url ?? '#'} className="hover:underline text-white">
                                                {crumb.label}
                                            </Link>
                                            {index < breadcrumbs.length - 1 && <span>/</span>}
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        )}

                        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                            {posts.length > 0 ? (
                                posts.map((post) => <NyheterItem key={post.id} post={post} />)
                            ) : (
                                <p>Inga nyheter tillgängliga för denna kategori</p>
                            )}

                            {loadingMore && hasMore && Array.from({ length: 3 }, (_, i) => (
                                <NyheterItemSkeleton key={`skeleton-${i}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </MaxWidthWrapper>
        </div>
    );
}