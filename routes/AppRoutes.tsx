import React, { Dispatch, ReactNode, SetStateAction, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Stats } from '../components/Stats';
import { Clients } from '../components/Clients';
import { Innovation } from '../components/Innovation';
import { Capabilities } from '../components/Capabilities';
import { AIServices } from '../components/AIServices';
import { AIProjects } from '../components/AIProjects';
import { Contact } from '../components/Contact';
import { AboutUs } from '../components/AboutUs';
import { Offices } from '../components/Offices';
import { TypeA } from '../components/TypeA';
import { TypeB } from '../components/TypeB';
import { TypeC } from '../components/TypeC';
import { TypeD } from '../components/TypeD';
import { PhilanthropyImpact } from '../components/PhilanthropyImpact';
import { Careers } from '../components/Careers';
import { InternalNews } from '../components/InternalNews';
import { PrivacyPolicy } from '../components/PrivacyPolicy';
import { CookiePolicy } from '../components/CookiePolicy';
import { TermsConditions } from '../components/TermsConditions';
import { SignIn } from '../components/SignIn';
import { JoinUs } from '../components/JoinUs';
import { JoinUsAs } from '../components/JoinUsAs';
import { AdminDashboard } from '../components/AdminDashboard';
import { AdminReports } from '../components/AdminReports';
import { AdminManageApplicants } from '../components/AdminManageApplicants';
import { AdminAccessDenied } from '../components/AdminAccessDenied';
import { RoleDashboard } from '../components/RoleDashboard';
import { PageRoute } from './routeTypes';

const AUTH_STORAGE_KEY = 'lifewood_admin_authenticated';
const ADMIN_EMAIL_STORAGE_KEY = 'lifewood_admin_email';
const ADMIN_BG_VIDEO_URL = 'https://www.pexels.com/download/video/34645742/';

const PAGE_PATHS: Record<PageRoute, string> = {
  home: '/',
  'ai-services': '/ai-services',
  'ai-projects': '/ai-projects',
  'contact-us': '/contact-us',
  'about-us': '/about-us',
  offices: '/offices',
  'philanthropy-impact': '/philanthropy-impact',
  careers: '/careers',
  'join-us': '/join-us',
  'join-us-as': '/join-us-as',
  'join-us-as-employee': '/join-us-as-employee',
  'join-us-as-intern': '/join-us-as-intern',
  'type-a-data-servicing': '/type-a-data-servicing',
  'type-b-horizontal-llm-data': '/type-b-horizontal-llm-data',
  'type-c-vertical-llm-data': '/type-c-vertical-llm-data',
  'type-d-aigc': '/type-d-aigc',
  'internal-news': '/internal-news',
  'privacy-policy': '/privacy-policy',
  'cookie-policy': '/cookie-policy',
  'terms-and-conditions': '/terms-and-conditions',
  signin: '/sign-in',
  'forgot-password': '/forgot-password',
  'admin-dashboard': '/admin-dashboard',
  'admin-analytics': '/admin-analytics',
  'admin-evaluation': '/admin-evaluation',
  'admin-reports': '/admin-reports',
  'admin-manage-interns': '/admin-manage-interns',
  'admin-manage-applicants': '/admin-manage-applicants',
  'admin-manage-employees': '/admin-manage-employees',
  'admin-access-denied': '/admin-access-denied',
  'intern-dashboard': '/intern-dashboard',
  'employee-dashboard': '/employee-dashboard',
  'applicant-dashboard': '/applicant-dashboard'
};

const PATH_TO_PAGE = Object.entries(PAGE_PATHS).reduce<Record<string, PageRoute>>((acc, [page, path]) => {
  acc[path] = page as PageRoute;
  return acc;
}, Object.create(null));

Object.assign(PATH_TO_PAGE, {
  '/services': 'ai-services',
  '/projects': 'ai-projects',
  '/contact': 'contact-us',
  '/about': 'about-us',
  '/impact': 'philanthropy-impact',
  '/privacy': 'privacy-policy',
  '/terms': 'terms-and-conditions',
  '/signin': 'signin',
  '/sign-in': 'signin',
  '/forgot-password': 'forgot-password',
  '/join-us': 'join-us'
});

const normalizePath = (value: string) => {
  const withoutQuery = value.split(/[?#]/)[0];
  const trimmed = withoutQuery.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
};

const getPageFromPath = (pathname: string): PageRoute => {
  const normalized = normalizePath(pathname);
  return PATH_TO_PAGE[normalized] ?? 'home';
};

const ADMIN_PAGES = new Set<PageRoute>([
  'admin-dashboard',
  'admin-analytics',
  'admin-evaluation',
  'admin-reports',
  'admin-manage-interns',
  'admin-manage-applicants',
  'admin-manage-employees'
]);

const AdminBackground: React.FC = () => (
  <div className="pointer-events-none fixed inset-0 z-0">
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      className="h-full w-full object-cover"
      aria-hidden="true"
    >
      <source src={ADMIN_BG_VIDEO_URL} type="video/mp4" />
    </video>
    <div className="absolute inset-0 bg-gradient-to-b from-white/48 via-white/42 to-lifewood-seaSalt/45"></div>
  </div>
);

const AdminLayout: React.FC<{ children: ReactNode }> = ({ children }) => (
  <>
    <AdminBackground />
    <div className="relative z-20">{children}</div>
  </>
);

interface AppRoutesProps {
  theme: 'light' | 'dark';
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: Dispatch<SetStateAction<boolean>>;
  authRoleId: number | null;
  setAuthRoleId: Dispatch<SetStateAction<number | null>>;
  authRoleName: string | null;
  setAuthRoleName: Dispatch<SetStateAction<string | null>>;
}

type NavigateTo = (page: PageRoute) => void;

const HomeContent: React.FC<{ navigateTo: NavigateTo }> = ({ navigateTo }) => (
  <>
    <div key="home-page-wrapper">
      <Hero navigateTo={navigateTo} />
      <div className="relative z-10 bg-lifewood-seaSalt dark:bg-[#020804]">
        <About />
        <Stats />
        <Clients />
        <Innovation />
        <Capabilities />
      </div>
    </div>
  </>
);

export const AppRoutes: React.FC<AppRoutesProps> = ({
  theme,
  isAdminAuthenticated,
  setIsAdminAuthenticated,
  authRoleId,
  setAuthRoleId,
  authRoleName,
  setAuthRoleName
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage = getPageFromPath(location.pathname);
  const isAdminPage = ADMIN_PAGES.has(currentPage);
  const isAuthPage = currentPage === 'signin' || currentPage === 'forgot-password';
  const showChrome =
    !isAuthPage &&
    !isAdminPage &&
    currentPage !== 'admin-access-denied' &&
    currentPage !== 'intern-dashboard' &&
    currentPage !== 'employee-dashboard' &&
    currentPage !== 'applicant-dashboard';

  const navigateTo = useCallback<NavigateTo>((page) => {
    const destination = PAGE_PATHS[page];
    if (!destination) return;
    const hasWindow = typeof window !== 'undefined';

    if (page === 'signin') {
      if (hasWindow) {
        authService.logout();
      }
      setIsAdminAuthenticated(false);
      setAuthRoleId(null);
      setAuthRoleName(null);
      navigate(destination);
      if (hasWindow) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (ADMIN_PAGES.has(page)) {
      const hasAuth = hasWindow && localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
      if (!hasAuth) {
        setIsAdminAuthenticated(false);
        navigate(PAGE_PATHS['signin']);
        if (hasWindow) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }
      const isAdmin = (authRoleId ?? Number(localStorage.getItem('lifewood_role_id'))) === 1;
      if (!isAdmin) {
        navigate(PAGE_PATHS['admin-access-denied']);
        return;
      }
      setIsAdminAuthenticated(true);
    }

    navigate(destination);
    if (hasWindow) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [navigate, authRoleId, setIsAdminAuthenticated, setAuthRoleId, setAuthRoleName]);

  const hasAuthInStorage = typeof window !== 'undefined' && localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  const storedRoleId = typeof window !== 'undefined' ? Number(localStorage.getItem('lifewood_role_id')) : NaN;
  const isAuthenticated = isAdminAuthenticated || hasAuthInStorage;
  const isAdminUser = (authRoleId ?? storedRoleId) === 1 && isAuthenticated;

  const renderAdmin = (element: ReactNode) =>
    !isAuthenticated
      ? <Navigate to={PAGE_PATHS['signin']} replace />
      : isAdminUser
        ? <AdminLayout>{element}</AdminLayout>
        : <Navigate to={PAGE_PATHS['admin-access-denied']} replace />;

  const resolveRoleDashboard = () => {
    const storedRoleName = typeof window !== 'undefined' ? localStorage.getItem('lifewood_role_name') : null;
    if ((authRoleId ?? storedRoleId) === 1) return PAGE_PATHS['admin-dashboard'];
    const roleLabel = (authRoleName || storedRoleName || '').toLowerCase();
    if (roleLabel.includes('intern')) return PAGE_PATHS['intern-dashboard'];
    if (roleLabel.includes('employee')) return PAGE_PATHS['employee-dashboard'];
    if (roleLabel.includes('applicant')) return PAGE_PATHS['applicant-dashboard'];
    return PAGE_PATHS['home'];
  };

  const renderRoleDashboard = (roleLabel: string, targetPage: PageRoute) => {
    if (!isAuthenticated) {
      return <Navigate to={PAGE_PATHS['signin']} replace />;
    }

    const expected = resolveRoleDashboard();
    if (PAGE_PATHS[targetPage] !== expected) {
      return <Navigate to={expected} replace />;
    }

    return <RoleDashboard roleLabel={roleLabel} navigateTo={navigateTo} />;
  };

  return (
    <div className="relative min-h-screen bg-lifewood-seaSalt dark:bg-[#020804]">
      {showChrome && (
        <Navbar
          navigateTo={navigateTo}
          currentPage={currentPage}
          isAdminAuthenticated={isAdminUser}
        />
      )}

      <main className="relative">
        <Routes>
          <Route path="/" element={<HomeContent navigateTo={navigateTo} />} />
          <Route path="/ai-services" element={<AIServices theme={theme} navigateTo={navigateTo} />} />
          <Route path="/ai-projects" element={<AIProjects theme={theme} />} />
          <Route path="/contact-us" element={<Contact theme={theme} navigateTo={navigateTo} />} />
          <Route path="/about-us" element={<AboutUs theme={theme} navigateTo={navigateTo} />} />
          <Route path="/offices" element={<Offices theme={theme} />} />
          <Route path="/philanthropy-impact" element={<PhilanthropyImpact />} />
          <Route path="/careers" element={<Careers navigateTo={navigateTo} />} />
          <Route path="/join-us" element={<Navigate to={PAGE_PATHS['join-us-as']} replace />} />
          <Route path="/join-us-as" element={<JoinUsAs navigateTo={navigateTo} />} />
          <Route path="/join-us-as-employee" element={<JoinUs navigateTo={navigateTo} variant="employee" />} />
          <Route path="/join-us-as-intern" element={<JoinUs navigateTo={navigateTo} variant="intern" />} />
          <Route path="/internal-news" element={<InternalNews navigateTo={navigateTo} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy navigateTo={navigateTo} />} />
          <Route path="/cookie-policy" element={<CookiePolicy navigateTo={navigateTo} />} />
          <Route path="/terms-and-conditions" element={<TermsConditions navigateTo={navigateTo} />} />
          <Route
            path="/privacy"
            element={<Navigate to={PAGE_PATHS['privacy-policy']} replace />}
          />
          <Route
            path="/terms"
            element={<Navigate to={PAGE_PATHS['terms-and-conditions']} replace />}
          />
          <Route path="/type-a-data-servicing" element={<TypeA theme={theme} navigateTo={navigateTo} />} />
          <Route path="/type-b-horizontal-llm-data" element={<TypeB theme={theme} navigateTo={navigateTo} />} />
          <Route path="/type-c-vertical-llm-data" element={<TypeC theme={theme} navigateTo={navigateTo} />} />
          <Route path="/type-d-aigc" element={<TypeD navigateTo={navigateTo} />} />
          <Route path="/signin" element={<Navigate to={PAGE_PATHS['signin']} replace />} />
          <Route
            path="/sign-in"
            element={(
              <SignIn
                navigateTo={navigateTo}
                onAuthSuccess={({ roleId, roleName }) => {
                  setIsAdminAuthenticated(true);
                  setAuthRoleId(roleId);
                  setAuthRoleName(roleName);
                }}
              />
            )}
          />
          <Route
            path="/forgot-password"
            element={(
              <SignIn
                navigateTo={navigateTo}
                initialAuthMode="forgot"
                onAuthSuccess={({ roleId, roleName }) => {
                  setIsAdminAuthenticated(true);
                  setAuthRoleId(roleId);
                  setAuthRoleName(roleName);
                }}
              />
            )}
          />
          <Route path="/admin-dashboard" element={renderAdmin(<AdminDashboard navigateTo={navigateTo} />)} />
          <Route path="/admin-reports" element={renderAdmin(<AdminReports navigateTo={navigateTo} />)} />
          <Route
            path="/admin-manage-applicants"
            element={renderAdmin(<AdminManageApplicants navigateTo={navigateTo} />)}
          />
          <Route path="/admin-access-denied" element={<AdminAccessDenied navigateTo={navigateTo} />} />
          <Route path="/intern-dashboard" element={renderRoleDashboard('Intern', 'intern-dashboard')} />
          <Route path="/employee-dashboard" element={renderRoleDashboard('Employee', 'employee-dashboard')} />
          <Route path="/applicant-dashboard" element={renderRoleDashboard('Applicant', 'applicant-dashboard')} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {showChrome && (
        <div className="relative z-20 bg-lifewood-seaSalt dark:bg-[#020804]">
          <Footer navigateTo={navigateTo} />
        </div>
      )}

      {/* Background Decorative Blobs */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-lifewood-green/5 dark:bg-lifewood-green/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-lifewood-saffron/5 dark:bg-lifewood-saffron/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
    </div>
  );
};
