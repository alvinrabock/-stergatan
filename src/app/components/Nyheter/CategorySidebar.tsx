'use client';

import { Button } from '@/app/components/ui/Button';
import { Category } from '@/types';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

type CategoryNode = Category & {
    children?: CategoryNode[];
    level: number;
};

type CategorySidebarProps = {
    categories: Category[];
    selectedSlug: string | null;
    expandedCategories: Set<string>;
    toggleExpanded: (id: string) => void;
    currentCategory: Category | null;
};

const CategorySidebar = ({
    categories,
    selectedSlug,
    expandedCategories,
    toggleExpanded,
    currentCategory
}: CategorySidebarProps) => {
    const router = useRouter();

    // Map the categories to CategoryNode, ensuring level and children properties are included
    const mapCategoriesToNodes = (categories: Category[], level: number = 0): CategoryNode[] => {
        return categories.map((category) => {
            const cat = category as Category & { children?: Category[] };
            return {
                ...cat,
                level,
                children: cat.children ? mapCategoriesToNodes(cat.children, level + 1) : []
            };
        });
    };

    const categoriesWithLevel: CategoryNode[] = mapCategoriesToNodes(categories);

    const renderCategoryTree = (nodes: CategoryNode[], level: number = 0) => {
        return nodes.map((node) => {
            const isSelected = selectedSlug === node.slug || currentCategory?.id === node.id;
            const isExpanded = expandedCategories.has(node.id) || currentCategory?.id === node.id;
            const hasChildren = node.children && node.children.length > 0;

            // Initialize the base category URL
            let categoryUrl = '';
            if (node.breadcrumbs && node.breadcrumbs.length > 0) {
                categoryUrl = node.breadcrumbs.map((crumb) => crumb.url).join('/');
            } else {
                categoryUrl = `/${node.slug}`;
            }

            if (node.parent && typeof node.parent !== 'string') {
                const parentCategoryNode: CategoryNode = {
                    ...node.parent,
                    level: 1,
                };
                const parentCategoryUrl = renderParentCategoryUrl(parentCategoryNode);
                categoryUrl = `${parentCategoryUrl}${categoryUrl}`;
            }

            return (
                <div key={node.id} className={`mb-1 ${level === 0 ? 'pt-2 border-t border-custom_dark_red border-border/20' : ''}`}>
                    <div
                        className={`flex items-center justify-between w-full rounded-md transition-colors cursor-pointer group 
  ${isSelected ? 'bg-white' : '!text-white'}
  gap-x-2
`}

                    >
                        <Button
                            variant="ghost"
                            onClick={() => router.push(`/nyheter${categoryUrl}`)}
                            className={`flex-1 justify-start text-xl font-medium w-full h-10 uppercase oswald-font
                            ${isSelected ? 'text-black' : 'text-white'}
                        `}
                        >
                            {node.title}
                        </Button>

                        {hasChildren && (
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleExpanded(node.id);
                                }}
                                className={`h-8 w-8 flex items-center justify-center p-0 cursor-pointer 
                            rounded-md transition-colors
                            ${isSelected ? 'text-black ' : 'text-white'}
                            group-hover:bg-white/20
                          `}
                            >
                                {isExpanded ? (
                                    <ChevronDownIcon className="h-4 w-4" />
                                ) : (
                                    <ChevronRightIcon className="h-4 w-4" />
                                )}
                            </div>
                        )}
                    </div>

                    {isExpanded && hasChildren && (
                        <div className="ml-2 mt-1 border-l border-border/30 pl-4 animate-in slide-in-from-left-2 duration-200">
                            {renderCategoryTree(node.children!, level + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    const renderParentCategoryUrl = (parent: CategoryNode): string => {
        // Ensure the parent is a valid CategoryNode and has a slug
        if (typeof parent.slug !== 'string') {
            return ''; // Return empty string if parent is not a valid CategoryNode
        }

        let parentUrl = `/nyheter/${parent.slug}`;

        // Check if parent.parent exists and is a CategoryNode
        if (parent.parent && typeof parent.parent !== 'string' && 'slug' in parent.parent) {
            // Type cast parent.parent to CategoryNode
            const parentCategoryUrl = renderParentCategoryUrl(parent.parent as CategoryNode);
            // Ensure we don't add duplicate slugs
            if (parentCategoryUrl !== parentUrl) {
                parentUrl = `${parentCategoryUrl}${parentUrl}`;
            }
        }

        return parentUrl;
    };

    return (
        <div className="w-full h-auto overflow-y-auto">
            <Button
                variant={selectedSlug === null ? 'white' : 'ghost'}
                onClick={() => router.push('/nyheter')}
                className={`flex-1 w-full justify-start text-xl font-medium h-10 px-3 uppercase oswald-font 
                    ${selectedSlug === null ? 'text-black' : 'text-white'}
                `}
            >
                Senaste nytt
            </Button>

            {categoriesWithLevel.length > 0 ? (
                <div>{renderCategoryTree(categoriesWithLevel)}</div>
            ) : (
                <div className="text-white text-center mt-4">Inga kategorier tillgängliga.</div>
            )}
        </div>
    );
};

export default CategorySidebar;
