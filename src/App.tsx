import { BladeProvider } from '@razorpay/blade/components';
import { bladeTheme } from '@razorpay/blade/tokens';
import { Provider, useSeasons } from './state';
import { TopNav, SideNav, PageHeader, ApprovalDrawer, WhatsAppModal, Toast, Tour } from './components';
import { Overview, YearView, MonthView, WeekView, ReviewView, ControlsView, ActivityView } from './views';

function Content() {
  const { view } = useSeasons();
  const V = { overview: Overview, year: YearView, month: MonthView, week: WeekView, review: ReviewView, controls: ControlsView, activity: ActivityView }[view];
  return (
    <div className="app">
      <TopNav />
      <div className="body">
        <SideNav />
        <main className="main">
          <div className="page">
            <PageHeader />
            <V />
            <p className="footer-note">
              Prototype for the Razorpay AI PM Build Challenge (ISB, 2026). Not a live Razorpay product.<br />
              All merchants and numbers are synthetic, shaped on interviews with nine merchants and one real merchant’s payment pattern. Benchmarks marked “similar merchants” are illustrative.
            </p>
          </div>
        </main>
      </div>
      <ApprovalDrawer />
      <WhatsAppModal />
      <Toast />
      <Tour />
    </div>
  );
}

export default function App() {
  return (
    <BladeProvider themeTokens={bladeTheme} colorScheme="light">
      <Provider><Content /></Provider>
    </BladeProvider>
  );
}
