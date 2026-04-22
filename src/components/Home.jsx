import Layout from './Layout';
import SafetyCard from './SafteyCard';
import QuickActions from './QuickActions';
import SOSButton from './SosButton';
import Features from './Features';
import './Home.css';

export default function Home() {
  return (
    <Layout currentPageName="Home">
      <div className="container">
        <SafetyCard />
        <QuickActions />
        <SOSButton />
        <Features />
      </div>
    </Layout>
  );
}
