import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from '@/App';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import { PlanProvider } from '@/contexts/PlanContext';
import { UserProvider } from '@/contexts/UserContext';
import { CategoryProvider } from '@/contexts/CategoryContext';
import { FacilityProvider } from '@/contexts/FacilityContext';
import { PaymentMethodProvider } from '@/contexts/PaymentMethodProvider.jsx';
import { BannerProvider } from '@/contexts/BannerContext';
import { MenuProvider } from '@/contexts/MenuContext';
import { CityProvider } from '@/contexts/CityContext';
import { AdStatusProvider } from '@/contexts/AdStatusContext';
import { AdProvider } from '@/hooks/useAds';
import { MercadoPagoProvider } from '@/contexts/MercadoPagoContext';
import { PaymentProvider } from '@/contexts/PaymentContext';
import { MapboxProvider } from '@/contexts/MapboxContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { EmailProvider } from '@/contexts/EmailContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { LogProvider } from '@/contexts/LogContext';
import { ReviewProvider } from '@/contexts/ReviewContext';
import { PaymentGatewayProvider } from '@/contexts/PaymentGatewayContext';
import ScrollToTop from '@/components/ScrollToTop';
import '@/index.css';

const AppProviders = ({ children }) => (
  <HelmetProvider>
      <ThemeProvider>
          <LoadingProvider>
              <Router>
                <ScrollToTop />
                <AuthProvider>
                    <LogProvider>
                        <SettingsProvider>
                            <EmailProvider>
                                <UserProvider>
                                    <PlanProvider>
                                        <PaymentGatewayProvider>
                                            <PaymentProvider>
                                                <MercadoPagoProvider>
                                                    <MapboxProvider>
                                                        <CategoryProvider>
                                                            <FacilityProvider>
                                                                <PaymentMethodProvider>
                                                                    <BannerProvider>
                                                                        <MenuProvider>
                                                                            <CityProvider>
                                                                                <AdStatusProvider>
                                                                                    <AdProvider>
                                                                                        <ReviewProvider>
                                                                                            {children}
                                                                                        </ReviewProvider>
                                                                                    </AdProvider>
                                                                                </AdStatusProvider>
                                                                            </CityProvider>
                                                                        </MenuProvider>
                                                                    </BannerProvider>
                                                                </PaymentMethodProvider>
                                                            </FacilityProvider>
                                                        </CategoryProvider>
                                                    </MapboxProvider>
                                                </MercadoPagoProvider>
                                            </PaymentProvider>
                                        </PaymentGatewayProvider>
                                    </PlanProvider>
                                </UserProvider>
                            </EmailProvider>
                        </SettingsProvider>
                    </LogProvider>
                </AuthProvider>
              </Router>
          </LoadingProvider>
      </ThemeProvider>
  </HelmetProvider>
);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AppProviders>
    <App />
    <Toaster />
  </AppProviders>
);