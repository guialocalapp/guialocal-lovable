
import React from 'react';
    import { Routes, Route, Navigate } from 'react-router-dom';
    import { useAuth } from '@/hooks/useAuth';

    import SiteLayout from '@/components/layouts/SiteLayout';
    import AdminLayout from '@/components/layouts/AdminLayout';
    import ClientLayout from '@/components/layouts/ClientLayout';

    import Home from '@/pages/site/Home';
    import Login from '@/pages/auth/Login';
    import Register from '@/pages/auth/Register';
    import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
    import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
    import RedefinePasswordPage from '@/pages/auth/RedefinePasswordPage';
    import ListingsPage from '@/pages/site/ListingsPage';
    import ListingDetailPage from '@/pages/site/ListingDetailPage';
    import PlansPage from '@/pages/site/PlansPage';
    import CheckoutPage from '@/pages/site/CheckoutPage';
    import PixPaymentPage from '@/pages/site/PixPaymentPage';
    import SuccessPage from '@/pages/site/SuccessPage';
    import AboutPage from '@/pages/site/AboutPage';
    import PrivacyPolicyPage from '@/pages/site/PrivacyPolicyPage';
    import TermsOfServicePage from '@/pages/site/TermsOfServicePage';
    import AffiliatesPage from '@/pages/site/AffiliatesPage';

    import AdminDashboard from '@/pages/admin/AdminDashboard';
    import AdminUsers from '@/pages/admin/AdminUsers';
    import UserFormPage from '@/pages/admin/UserFormPage';
    import AdminClients from '@/pages/admin/AdminClients';
    import ClientFormPage from '@/pages/admin/ClientFormPage';
    import AdminAds from '@/pages/admin/AdminAds';
    import AdFormPage from '@/pages/admin/AdFormPage';
    import AdminAdStatus from '@/pages/admin/AdminAdStatus';
    import AdminCategories from '@/pages/admin/AdminCategories';
    import CategoryFormPage from '@/pages/admin/CategoryFormPage';
    import AdminFacilities from '@/pages/admin/AdminFacilities';
    import FacilityFormPage from '@/pages/admin/FacilityFormPage';
    import AdminPaymentMethods from '@/pages/admin/AdminPaymentMethods';
    import AdminBanners from '@/pages/admin/AdminBanners';
    import BannerFormPage from '@/pages/admin/BannerFormPage';
    import AdminMenus from '@/pages/admin/AdminMenus';
    import MenuFormPage from '@/pages/admin/MenuFormPage';
    import AdminPlans from '@/pages/admin/AdminPlans';
    import PlanFormPage from '@/pages/admin/PlanFormPage';
    import AdminSettings from '@/pages/admin/AdminSettings';
    import AdminSmtp from '@/pages/admin/AdminSmtp';
    import AdminMercadoPagoSettings from '@/pages/admin/AdminMercadoPagoSettings';
    import AdminMapbox from '@/pages/admin/AdminMapbox';
    import AdminCloudflare from '@/pages/admin/AdminCloudflare';
    import AdminCities from '@/pages/admin/AdminCities';
    import AdminPayments from '@/pages/admin/AdminPayments';
    import AdminPaymentDetails from '@/pages/admin/AdminPaymentDetails';
    import AdminEmailLogs from '@/pages/admin/AdminEmailLogs';
    import AdminAffiliates from '@/pages/admin/AdminAffiliates';
    import AdminSystemLogs from '@/pages/admin/AdminSystemLogs';
    import AdminReviews from '@/pages/admin/AdminReviews';

    import ClientDashboard from '@/pages/client/ClientDashboard';
    import ClientAds from '@/pages/client/ClientAds';
    import ClientAdFormPage from '@/pages/client/ClientAdFormPage';
    import ClientProfile from '@/pages/client/ClientProfile';
    import ClientPlans from '@/pages/client/ClientPlans';
    import ClientPayments from '@/pages/client/ClientPayments';
    import ClientAffiliates from '@/pages/client/ClientAffiliates';
    import ClientReviews from '@/pages/client/ClientReviews';

    import GlobalLoader from '@/components/GlobalLoader';

    const PrivateRoute = ({ children, roles }) => {
      const { user, loading } = useAuth();

      if (loading) {
        return <div className="text-center py-20">Carregando...</div>;
      }

      if (!user || !user.profile || !roles.includes(user.profile.role)) {
        return <Navigate to="/login" />;
      }
      return children;
    };

    function App() {
      return (
        <>
        <GlobalLoader />
        <Routes>
          {/* Site público */}
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />
            <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
            <Route path="/resetar-senha" element={<ResetPasswordPage />} />
            <Route path="/redefinir-senha" element={<RedefinePasswordPage />} />
            <Route path="/planos" element={<PlansPage />} />
            <Route path="/checkout/:planId" element={<CheckoutPage />} />
            <Route path="/pagamento/pix" element={<PixPaymentPage />} />
            <Route path="/pagamento-sucesso" element={<SuccessPage />} />
            
            <Route path="/anuncios" element={<ListingsPage />} />
            <Route path="/anuncios/:categorySlug" element={<ListingsPage />} />
            <Route path="/anuncios/cidade/:citySlug" element={<ListingsPage />} />
            <Route path="/anuncios/cidade/:citySlug/:categorySlug" element={<ListingsPage />} />

            <Route path="/anuncio/:anuncioSlug" element={<ListingDetailPage />} />
            <Route path="/quem-somos" element={<AboutPage />} />
            <Route path="/politica-de-privacidade" element={<PrivacyPolicyPage />} />
            <Route path="/termos-de-servico" element={<TermsOfServicePage />} />
            <Route path="/afiliados" element={<AffiliatesPage />} />
          </Route>

          {/* Painel Admin */}
          <Route 
            path="/admin"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/new" element={<UserFormPage />} />
            <Route path="users/edit/:id" element={<UserFormPage />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="clients/new" element={<ClientFormPage />} />
            <Route path="clients/edit/:id" element={<ClientFormPage />} />
            <Route path="listings" element={<AdminAds />} />
            <Route path="listings/new" element={<AdFormPage />} />
            <Route path="listings/edit/:id" element={<AdFormPage />} />
            <Route path="listing-status" element={<AdminAdStatus />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="categories/new" element={<CategoryFormPage />} />
            <Route path="categories/edit/:id" element={<CategoryFormPage />} />
            <Route path="facilities" element={<AdminFacilities />} />
            <Route path="facilities/new" element={<FacilityFormPage />} />
            <Route path="facilities/edit/:id" element={<FacilityFormPage />} />
            <Route path="payment-methods" element={<AdminPaymentMethods />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="banners/new" element={<BannerFormPage />} />
            <Route path="banners/edit/:id" element={<BannerFormPage />} />
            <Route path="menus" element={<AdminMenus />} />
            <Route path="menus/new" element={<MenuFormPage />} />
            <Route path="menus/edit/:id" element={<MenuFormPage />} />
            <Route path="plans" element={<AdminPlans />} />
            <Route path="plans/new" element={<PlanFormPage />} />
            <Route path="plans/edit/:id" element={<PlanFormPage />} />
            <Route path="cities" element={<AdminCities />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="payments/:id" element={<AdminPaymentDetails />} />
            <Route path="affiliates" element={<AdminAffiliates />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="email" element={<AdminSmtp />} />
            <Route path="mercadopago-settings" element={<AdminMercadoPagoSettings />} />
            <Route path="mapbox" element={<AdminMapbox />} />
            <Route path="cloudflare" element={<AdminCloudflare />} />
            <Route path="email-logs" element={<AdminEmailLogs />} />
            <Route path="system-logs" element={<AdminSystemLogs />} />
            <Route path="reviews" element={<AdminReviews />} />
          </Route>

          {/* Painel Cliente */}
          <Route 
            path="/client"
            element={
              <PrivateRoute roles={['client']}>
                <ClientLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="listings" element={<ClientAds />} />
            <Route path="listings/new" element={<ClientAdFormPage />} />
            <Route path="listings/edit/:id" element={<ClientAdFormPage />} />
            <Route path="profile" element={<ClientProfile />} />
            <Route path="plans" element={<ClientPlans />} />
            <Route path="payments" element={<ClientPayments />} />
            <Route path="affiliates" element={<ClientAffiliates />} />
            <Route path="reviews" element={<ClientReviews />} />
          </Route>

          {/* Catch-all route, redirects to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        </>
      );
    }

    export default App;
