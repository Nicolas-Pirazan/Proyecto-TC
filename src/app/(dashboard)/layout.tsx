import { AppBarComponent as AppBar } from '@/components/AppBar';
function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <AppBar />
      {children}
    </main>
  );
}

export default DashboardLayout;
