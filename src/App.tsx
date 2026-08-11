import { Navigate, Route, Routes } from 'react-router-dom';
import { FilterProvider } from './context/FilterContext';
import Layout from './components/Layout';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import IsuWilayah from './pages/IsuWilayah';
import IsuDetail from './pages/IsuDetail';
import IsuKomisi from './pages/IsuKomisi';
import KinerjaDPRD from './pages/KinerjaDPRD';
import PersonalDPRD from './pages/PersonalDPRD';
import AnggotaProfile from './pages/AnggotaProfile';
import MediaMonitoring from './pages/MediaMonitoring';
import NewsDetail from './pages/NewsDetail';
import MediaSosial from './pages/MediaSosial';
import IsuNegatif from './pages/IsuNegatif';
import Intelligence from './pages/Intelligence';
import { komisiList } from './data/komisi';
import PimpinanLayout from './pages/pimpinan/PimpinanLayout';
import ExecutiveOverview from './pages/pimpinan/ExecutiveOverview';
import KinerjaPimpinan from './pages/pimpinan/KinerjaPimpinan';
import PersonalIssues from './pages/pimpinan/PersonalIssues';
import MediaExposure from './pages/pimpinan/MediaExposure';
import DigitalAssets from './pages/pimpinan/DigitalAssets';
import DigitalPerformance from './pages/pimpinan/DigitalPerformance';
import PublicEngagement from './pages/pimpinan/PublicEngagement';
import StrategicAttention from './pages/pimpinan/StrategicAttention';

function App() {
  return (
    <FilterProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ExecutiveDashboard />} />
          <Route path="/isu-wilayah" element={<IsuWilayah />} />
          <Route path="/isu-wilayah/:id" element={<IsuDetail />} />
          <Route path="/isu-komisi" element={<Navigate to={`/isu-komisi/${komisiList[0].id}`} replace />} />
          <Route path="/isu-komisi/:komisiId" element={<IsuKomisi />} />
          <Route path="/kinerja" element={<KinerjaDPRD />} />
          <Route path="/personal" element={<PersonalDPRD />} />
          <Route path="/personal/:id" element={<AnggotaProfile />} />
          <Route path="/media-monitoring" element={<MediaMonitoring />} />
          <Route path="/media-monitoring/:id" element={<NewsDetail />} />
          <Route path="/media-sosial" element={<MediaSosial />} />
          <Route path="/isu-negatif" element={<IsuNegatif />} />
          <Route path="/intelligence" element={<Intelligence />} />

          <Route path="/pimpinan" element={<PimpinanLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<ExecutiveOverview />} />
            <Route path="kinerja" element={<KinerjaPimpinan />} />
            <Route path="personal-issues" element={<PersonalIssues />} />
            <Route path="media-exposure" element={<MediaExposure />} />
            <Route path="digital-assets" element={<DigitalAssets />} />
            <Route path="digital-performance" element={<DigitalPerformance />} />
            <Route path="public-engagement" element={<PublicEngagement />} />
            <Route path="strategic-attention" element={<StrategicAttention />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </FilterProvider>
  );
}

export default App;
