import { supabase } from '@/lib/customSupabaseClient';

    const fetchAds = async () => {
      const { data: activeStatus } = await supabase
        .from('listing_statuses')
        .select('id')
        .eq('name', 'Ativo')
        .single();

      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          opening_hours,
          profiles:user_id(plan_id),
          cities(name, state),
          listing_statuses(name),
          listing_facilities(facility_id),
          listing_payment_methods(payment_method_id),
          listing_categories!inner(category_id)
        `)
        .eq('moderation_status', 'Aprovado')
        .eq('listing_status_id', activeStatus.id);

      if (error) {
        console.error('Error fetching ads:', error);
        return [];
      }

      const adsWithSingleCategory = data.map(ad => {
        return {
          ...ad,
          category_id: ad.listing_categories[0]?.category_id,
        };
      });
      
      return adsWithSingleCategory;
    };


    const fetchAllAdsApi = async () => {
        const { data, error } = await supabase
            .from('listings')
            .select(`
                *,
                profiles:user_id (
                    full_name,
                    email,
                    plan:plan_id ( name )
                ),
                cities ( name, state ),
                listing_statuses ( name ),
                listing_categories(category_id),
                listing_facilities(facility_id),
                listing_payment_methods(payment_method_id)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching all ads:', error);
            return [];
        }
        
        const adsWithSingleCategory = data.map(ad => {
          return {
            ...ad,
            category_id: ad.listing_categories[0]?.category_id,
          };
        });

        return adsWithSingleCategory;
    };

    const fetchAdByIdApi = async (id) => {
        const { data, error } = await supabase
            .from('listings')
            .select(`
                *,
                opening_hours,
                listing_categories(category_id),
                listing_facilities(facility_id),
                listing_payment_methods(payment_method_id)
            `)
            .eq('id', id)
            .single();
        
        if (error) {
            console.error(`Error fetching ad by id ${id}:`, error);
            return null;
        }

        const ad = {
          ...data,
          categories: data.listing_categories.map(lc => lc.category_id),
          facilities: data.listing_facilities.map(lf => lf.facility_id),
          payment_methods: data.listing_payment_methods.map(lpm => lpm.payment_method_id)
        };

        return ad;
    };


    const addAd = async (adData) => {
        const { categories, facilities, payment_methods, ...mainData } = adData;

        const { data: newAd, error } = await supabase
            .from('listings')
            .insert([mainData])
            .select()
            .single();

        if (error) {
            console.error('Error creating ad:', error);
            throw error;
        }

        if (newAd) {
          if (categories && categories.length > 0) {
            const listingCategories = categories.map(catId => ({
              listing_id: newAd.id,
              category_id: catId,
            }));
            const { error: catError } = await supabase.from('listing_categories').insert(listingCategories);
            if (catError) console.error('Error inserting categories:', catError);
          }
          
          if (facilities && facilities.length > 0) {
            const listingFacilities = facilities.map(facId => ({
              listing_id: newAd.id,
              facility_id: facId,
            }));
            const { error: facError } = await supabase.from('listing_facilities').insert(listingFacilities);
            if (facError) console.error('Error inserting facilities:', facError);
          }

          if (payment_methods && payment_methods.length > 0) {
            const listingPaymentMethods = payment_methods.map(pmId => ({
              listing_id: newAd.id,
              payment_method_id: pmId,
            }));
            const { error: pmError } = await supabase.from('listing_payment_methods').insert(listingPaymentMethods);
            if (pmError) console.error('Error inserting payment methods:', pmError);
          }
        }

        return newAd;
    };

    const updateAd = async (id, adData) => {
        const { categories, facilities, payment_methods, ...mainData } = adData;

        // Step 1: Delete all existing relations for this listing.
        const relationsToDelete = [
            supabase.from('listing_categories').delete().eq('listing_id', id),
            supabase.from('listing_facilities').delete().eq('listing_id', id),
            supabase.from('listing_payment_methods').delete().eq('listing_id', id)
        ];

        const deleteResults = await Promise.all(relationsToDelete);
        for (const result of deleteResults) {
            if (result.error) {
                console.error('Error deleting relations:', result.error);
                throw result.error;
            }
        }

        // Step 2: Update the main listing record.
        const { data: updatedAd, error: updateError } = await supabase
            .from('listings')
            .update(mainData)
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            console.error('Error updating ad:', updateError);
            throw updateError;
        }

        // Step 3: Insert the new relations.
        const relationsToInsert = [];

        if (categories && categories.length > 0) {
            const listingCategories = categories.map(catId => ({
                listing_id: id,
                category_id: catId,
            }));
            relationsToInsert.push(supabase.from('listing_categories').insert(listingCategories));
        }

        if (facilities && facilities.length > 0) {
            const listingFacilities = facilities.map(facId => ({
                listing_id: id,
                facility_id: facId,
            }));
            relationsToInsert.push(supabase.from('listing_facilities').insert(listingFacilities));
        }

        if (payment_methods && payment_methods.length > 0) {
            const listingPaymentMethods = payment_methods.map(pmId => ({
                listing_id: id,
                payment_method_id: pmId,
            }));
            relationsToInsert.push(supabase.from('listing_payment_methods').insert(listingPaymentMethods));
        }

        if (relationsToInsert.length > 0) {
            const insertResults = await Promise.all(relationsToInsert);
            for (const result of insertResults) {
                if (result.error) {
                    console.error('Error inserting new relations:', result.error);
                    throw result.error;
                }
            }
        }

        return updatedAd;
    };


    const deleteAd = async (id) => {
        const { error } = await supabase.from('listings').delete().eq('id', id);

        if (error) {
            console.error('Error deleting ad:', error);
            throw error;
        }

        return true;
    };

    export { fetchAds, fetchAllAdsApi, fetchAdByIdApi, addAd, updateAd, deleteAd };