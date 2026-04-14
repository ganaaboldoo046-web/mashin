import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loaded pages for Code Splitting
const Home = lazy(() => import('./pages/Home'));
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
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-800 border-t-primary rounded-full animate-spin"></div>
    </div>
);

/* 모바일 프레임 래퍼 - 사용자 페이지 전용 (430px 제한) */
function MobileLayout() {
  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-background-light dark:bg-background-dark relative shadow-2xl overflow-x-hidden border-x border-slate-200 dark:border-slate-800">
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* 사용자 페이지: 430px 모바일 프레임 적용 */}
            <Route element={<MobileLayout />}>
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
