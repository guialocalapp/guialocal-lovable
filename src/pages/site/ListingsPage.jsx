import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ListingsMap from '@/components/site/ListingsMap';
import ListingsHeader from '@/components/site/listings/ListingsHeader';
import ListingsFilters from '@/components/site/listings/ListingsFilters';
import ListingsGrid from '@/components/site/listings/ListingsGrid';
import { useAds } from '@/hooks/useAds.jsx';
import { useCategories } from '@/hooks/useCategories';
import { useCities } from '@/hooks/useCities';
import { useFacilities } from '@/hooks/useFacilities';
import { useMapSync } from '@/hooks/useMapSync';

const LISTINGS_PER_PAGE = 50;

const ListingsPage = () => {
    const { citySlug: citySlugParam, categorySlug: categorySlugParam } = useParams();
    const { publicAds, totalPublicAds, loading, fetchPublicAds, filterAdsByBounds } = useAds();
    const { structuredCategories, getCategoryWithChildren, categories } = useCategories();
    const { cities } = useCities();
    const { facilities } = useFacilities();
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const searchByMap = searchParams.get('map_search') === 'true';
    const queryTerm = searchParams.get('q') || '';
    const facilitiesParam = searchParams.get('facilities');
    const pageParam = parseInt(searchParams.get('page')) || 1;
    
    const [searchTerm, setSearchTerm] = useState(queryTerm);
    const [currentPage, setCurrentPage] = useState(pageParam);
    const [selectedCitySlug, setSelectedCitySlug] = useState(citySlugParam || 'todos');
    const [selectedCategorySlug, setSelectedCategorySlug] = useState(queryTerm ? 'all' : (categorySlugParam || 'all'));
    const [selectedFacilities, setSelectedFacilities] = useState(facilitiesParam ? facilitiesParam.split(',').filter(Boolean) : []);
    
    const [pageTitle, setPageTitle] = useState('Anúncios');
    const [pageDescription, setPageDescription] = useState('Encontre os melhores serviços e empresas.');
    const [viewMode, setViewMode] = useState('list');

    const { mapBounds, handleMapMove, resetMapNeedsUpdate, triggerMapUpdate } = useMapSync();

    const totalPages = Math.ceil(totalPublicAds / LISTINGS_PER_PAGE);

    const updateUrl = useCallback((params) => {
        const newParams = {
            city: selectedCitySlug,
            category: selectedCategorySlug,
            term: searchTerm,
            facilities: selectedFacilities,
            page: currentPage,
            map_search: searchByMap,
            ...params,
        };

        let path = '/anuncios';
        const citySegment = newParams.city && newParams.city !== 'todos' ? `/cidade/${newParams.city}` : '';
        const categorySegment = !newParams.term && newParams.category && newParams.category !== 'all' ? `/${newParams.category}` : '';

        if (citySegment) {
            path += citySegment;
            if (categorySegment) {
                path += categorySegment;
            }
        } else if (categorySegment) {
            path += categorySegment;
        }

        const newSearchParams = new URLSearchParams();
        if (newParams.term) newSearchParams.set('q', newParams.term);
        if (newParams.facilities && newParams.facilities.length > 0) newSearchParams.set('facilities', newParams.facilities.join(','));
        if (newParams.map_search) newSearchParams.set('map_search', 'true');
        if (newParams.page > 1) newSearchParams.set('page', newParams.page);

        const queryString = newSearchParams.toString();
        navigate(`${path}${queryString ? `?${queryString}` : ''}`, { replace: true });
    }, [navigate, selectedCitySlug, selectedCategorySlug, searchTerm, selectedFacilities, currentPage, searchByMap]);

    useEffect(() => {
        const isCitySlug = cities.some(c => c.slug === categorySlugParam);
        const finalCategorySlug = isCitySlug ? undefined : categorySlugParam;

        const currentCategorySlug = queryTerm ? 'all' : (finalCategorySlug || 'all');
        const categoryInfo = getCategoryWithChildren(currentCategorySlug);

        const filters = {
            citySlug: citySlugParam || (isCitySlug ? categorySlugParam : 'todos'),
            categoryIds: categoryInfo?.ids,
            searchTerm: queryTerm,
            facilityIds: (facilitiesParam || '').split(',').filter(Boolean),
        };
        fetchPublicAds({ page: pageParam, limit: LISTINGS_PER_PAGE, filters });

        let title = 'Todos os Anúncios';
        let description = 'Navegue por todos os nossos anúncios.';
        const currentCity = cities.find(c => c.slug === filters.citySlug);

        if (currentCity && currentCity.slug !== 'todos') {
            title = `Anúncios em ${currentCity.name}`;
            description = `Encontre os melhores comércios, restaurantes e serviços em ${currentCity.name}.`;
        }

        if (queryTerm) {
            title = `Resultados para "${queryTerm}"${currentCity && currentCity.slug !== 'todos' ? ` em ${currentCity.name}` : ''}`;
            description = `Exibindo anúncios que correspondem à sua busca por "${queryTerm}".`;
        } else if (categoryInfo && categoryInfo.mainCategory) {
            const categoryName = categoryInfo.mainCategory.name;
            title = currentCity && currentCity.slug !== 'todos' ? `${categoryName} em ${currentCity.name}` : `${categoryName}`;
            description = `Confira os melhores anúncios da categoria ${categoryName}${currentCity && currentCity.slug !== 'todos' ? ` em ${currentCity.name}` : ''}.`;
        }
        setPageTitle(title);
        setPageDescription(description);

    }, [fetchPublicAds, pageParam, citySlugParam, categorySlugParam, queryTerm, facilitiesParam, cities, getCategoryWithChildren, categories]);

    useEffect(() => {
        const isCitySlug = cities.some(c => c.slug === categorySlugParam);
        const finalCategorySlug = isCitySlug ? undefined : categorySlugParam;

        setCurrentPage(pageParam);
        setSelectedCitySlug(citySlugParam || (isCitySlug ? categorySlugParam : 'todos'));
        setSelectedCategorySlug(queryTerm ? 'all' : (finalCategorySlug || 'all'));
        setSearchTerm(queryTerm);
        const urlFacilities = (facilitiesParam || '').split(',').filter(Boolean);
        setSelectedFacilities(urlFacilities);
    }, [pageParam, citySlugParam, categorySlugParam, queryTerm, facilitiesParam, cities]);

    const displayedAds = useMemo(() => {
        if (searchByMap && mapBounds) {
            return filterAdsByBounds(publicAds, mapBounds);
        }
        return publicAds;
    }, [publicAds, mapBounds, searchByMap, filterAdsByBounds]);

    useEffect(() => {
        if (!loading && !searchByMap) {
            triggerMapUpdate();
        }
    }, [publicAds, searchByMap, loading, triggerMapUpdate]);

    const handleCityChange = (slug) => {
        updateUrl({ city: slug, page: 1 });
    };

    const handleCategoryChange = (slug) => {
        updateUrl({ category: slug, term: '', page: 1 });
    };
    
    const handleFacilityChange = (facilityId) => {
        const newSelection = selectedFacilities.includes(facilityId)
            ? selectedFacilities.filter(id => id !== facilityId)
            : [...selectedFacilities, facilityId];
        updateUrl({ facilities: newSelection, page: 1 });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        updateUrl({ category: 'all', term: searchTerm, page: 1 });
    };

    const clearSearch = () => {
        updateUrl({ category: 'all', term: '', page: 1 });
    };

    const toggleSearchMode = () => {
        updateUrl({ map_search: !searchByMap, page: 1 });
        if (searchByMap) triggerMapUpdate();
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            updateUrl({ page: newPage });
        }
    };

    return (
        <>
            <Helmet>
                <title>{`${pageTitle} | Guia Local`}</title>
                <meta name="description" content={pageDescription} />
            </Helmet>
            <div className="bg-background text-foreground min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <ListingsHeader
                        pageTitle={pageTitle}
                        pageDescription={pageDescription}
                        searchByMap={searchByMap}
                        displayedAds={displayedAds}
                        toggleSearchMode={toggleSearchMode}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                    />
                    <ListingsFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        queryTerm={queryTerm}
                        clearSearch={clearSearch}
                        handleSearch={handleSearch}
                        selectedCategorySlug={selectedCategorySlug}
                        handleCategoryChange={handleCategoryChange}
                        structuredCategories={structuredCategories}
                        selectedCitySlug={selectedCitySlug}
                        handleCityChange={handleCityChange}
                        cities={cities}
                        selectedFacilities={selectedFacilities}
                        handleFacilityChange={handleFacilityChange}
                        facilities={facilities}
                        searchByMap={searchByMap}
                    />

                    <div className="flex flex-col md:flex-row md:gap-8">
                        <div className={`w-full md:w-1/2 lg:w-3/5 ${viewMode === 'map' && 'hidden md:block'}`}>
                            <ListingsGrid
                                loading={loading}
                                displayedAds={displayedAds}
                                totalPages={totalPages}
                                currentPage={currentPage}
                                handlePageChange={handlePageChange}
                                searchByMap={searchByMap}
                            />
                        </div>

                        <div className={`w-full md:w-1/2 lg:w-2/5 md:sticky md:top-24 h-[50vh] md:h-[calc(100vh-8rem)] rounded-lg overflow-hidden mt-8 md:mt-0 ${viewMode === 'list' && 'hidden md:block'}`}>
                             <ListingsMap 
                                listings={publicAds} 
                                onMove={handleMapMove}
                                mapNeedsUpdate={!searchByMap}
                                onMapUpdated={resetMapNeedsUpdate}
                             />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ListingsPage;