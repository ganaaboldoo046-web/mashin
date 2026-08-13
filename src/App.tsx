import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Seo from './components/Seo';
import Home from './pages/Home';

// Lazy loaded pages for Code Splitting
const Search = lazy(() => import('./pages/Search'));
const Sell = lazy(() => import('./pages/Sell'));
const Saved = lazy(() => import('./pages/Saved'));
const Profile = lazy(() => import('./pages/Profile'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const CategoryDetail = lazy(() => import('./pages/CategoryDetail'));
const About = lazy(() => import('./pages/About'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));

const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProductList = lazy(() => import('./pages/admin/AdminProductList'));
const AdminProductCreate = lazy(() => import('./pages/admin/AdminProductCreate'));
const AdminBannerManage = lazy(() => import('./pages/admin/AdminBannerManage'));
const AdminCategoryManage = lazy(() => import('./pages/admin/AdminCategoryManage'));
const AdminOrderManage = lazy(() => import('./pages/admin/AdminOrderManage'));
const AdminExchangeRate = lazy(() => import('./pages/admin/AdminExchangeRate'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));

const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="w-10 h-10 border-4 border-line border-t-primary rounded-full animate-spin"></div>
    </div>
);

/* 사용자 페이지 래퍼: lg 미만은 430px 모바일 앱 프레임, lg 이상은 전체 너비 데스크탑 레이아웃 */
function SiteLayout() {
  return (
    <div className="relative mx-auto w-full max-w-app min-h-screen bg-canvas overflow-x-hidden border-x border-line shadow-xl lg:max-w-none lg:border-x-0 lg:shadow-none">
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Seo />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* 사용자 페이지: 모바일은 430px 프레임, 데스크탑은 1280px 레이아웃 */}
            <Route element={<SiteLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/category/:id" element={<CategoryDetail />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
            </Route>

            {/* 관리자 페이지: 전체 너비 (제한 없음) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProductList />} />
              <Route path="products/create" element={<AdminProductCreate />} />
              <Route path="products/edit/:id" element={<AdminProductCreate />} />
              <Route path="banners" element={<AdminBannerManage />} />
              <Route path="categories" element={<AdminCategoryManage />} />
              <Route path="orders" element={<AdminOrderManage />} />
              <Route path="exchange-rate" element={<AdminExchangeRate />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
