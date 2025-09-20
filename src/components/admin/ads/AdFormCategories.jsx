import React, { useState, useMemo } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';

const CategoryItem = ({ category, selectedCategories, onCategoryChange, level = 0 }) => {
    const hasChildren = category.children && category.children.length > 0;

    const handleCheckedChange = (checked) => {
        onCategoryChange(category.id, checked);
    };

    if (hasChildren) {
        return (
            <Accordion type="multiple" className="w-full">
                <AccordionItem value={`category-${category.id}`} className="border-b-0">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={handleCheckedChange}
                        />
                        <AccordionTrigger className="flex-1 p-0 hover:no-underline">
                             <Label htmlFor={`category-${category.id}`} className="font-normal cursor-pointer">
                                {category.name}
                            </Label>
                        </AccordionTrigger>
                    </div>
                    <AccordionContent className="pl-6 pt-2 pb-0">
                        {category.children.map(child => (
                            <CategoryItem
                                key={child.id}
                                category={child}
                                selectedCategories={selectedCategories}
                                onCategoryChange={onCategoryChange}
                                level={level + 1}
                            />
                        ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        );
    }

    return (
        <div className="flex items-center space-x-2 py-1">
            <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={handleCheckedChange}
            />
            <Label htmlFor={`category-${category.id}`} className="font-normal">
                {category.name}
            </Label>
        </div>
    );
};


const AdFormCategories = ({ formData, setFormField }) => {
    const { structuredCategories, categories, loading } = useCategories();
    const [searchTerm, setSearchTerm] = useState('');

    const handleCategoryChange = (categoryId, isChecked) => {
        const categoriesMap = new Map(categories.map(c => [c.id, c]));
        let newSelectedIds = new Set(formData.categories || []);

        const getAllChildrenIds = (catId) => {
            const childrenIds = [];
            const queue = [catId];
            while(queue.length > 0) {
                const currentId = queue.shift();
                const children = categories.filter(c => c.parent_id === currentId);
                for (const child of children) {
                    childrenIds.push(child.id);
                    queue.push(child.id);
                }
            }
            return childrenIds;
        };
        
        const addParents = (catId) => {
            let current = categoriesMap.get(catId);
            while (current && current.parent_id) {
                newSelectedIds.add(current.parent_id);
                current = categoriesMap.get(current.parent_id);
            }
        };

        if (isChecked) {
            newSelectedIds.add(categoryId);
            addParents(categoryId);
        } else {
            newSelectedIds.delete(categoryId);
            const childrenIds = getAllChildrenIds(categoryId);
            childrenIds.forEach(childId => newSelectedIds.delete(childId));
        }

        setFormField('categories', Array.from(newSelectedIds));
    };

    const filteredCategories = useMemo(() => {
        if (!searchTerm) {
            return structuredCategories;
        }

        const lowercasedFilter = searchTerm.toLowerCase();
        
        function filterAndMap(nodes) {
            const result = [];
            for (const node of nodes) {
                let children = [];
                if (node.children) {
                    children = filterAndMap(node.children);
                }

                if (node.name.toLowerCase().includes(lowercasedFilter) || children.length > 0) {
                    result.push({ ...node, children });
                }
            }
            return result;
        }

        return filterAndMap(structuredCategories);
    }, [searchTerm, structuredCategories]);

    if (loading) {
        return <p>Carregando categorias...</p>;
    }

    return (
        <div>
            <Label>Categorias</Label>
            <Input
                type="text"
                placeholder="Pesquisar categorias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="my-2"
            />
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto pr-2 rounded-md border border-input p-4 bg-background">
                {filteredCategories.length > 0 ? filteredCategories.map(category => (
                    <CategoryItem
                        key={category.id}
                        category={category}
                        selectedCategories={formData.categories || []}
                        onCategoryChange={handleCategoryChange}
                    />
                )) : <p className="text-sm text-muted-foreground text-center">Nenhuma categoria encontrada.</p>}
            </div>
        </div>
    );
};

export default AdFormCategories;