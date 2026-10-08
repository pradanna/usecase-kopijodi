import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEcosystemStore } from './store/useEcosystemStore';

// Apps
import { StageApp } from './apps/stage/StageApp';
import { CustomerApp } from './apps/customer/CustomerApp';
import { PosApp } from './apps/pos/PosApp';
import { KdsApp } from './apps/kds/KdsApp';
import { OpsApp } from './apps/ops/OpsApp';
import { BackofficeApp } from './apps/backoffice/BackofficeApp';
import { OwnerApp } from './apps/owner/OwnerApp';
import { PartnerApp } from './apps/partner/PartnerApp';
import { CrmApp } from './apps/crm/CrmApp';
import { ProposalApp } from './apps/proposal/ProposalApp';

export const App: React.FC = () => {
  const initStore = useEcosystemStore((state) => state.initStore);

  useEffect(() => {
    initStore();
  }, [initStore]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Main Demo Stage Orchestrator */}
        <Route path="/" element={<StageApp />} />
        <Route path="/stage" element={<StageApp />} />

        {/* Proposal Resmi & Penawaran Investasi */}
        <Route path="/proposal" element={<ProposalApp />} />

        {/* Micro-apps standalone routes (can be embedded or accessed directly) */}
        <Route path="/customer" element={<CustomerApp />} />
        <Route path="/pos" element={<PosApp />} />
        <Route path="/kds" element={<KdsApp />} />
        <Route path="/ops" element={<OpsApp />} />
        <Route path="/backoffice" element={<BackofficeApp />} />
        <Route path="/owner" element={<OwnerApp />} />
        <Route path="/partner" element={<PartnerApp />} />
        <Route path="/crm" element={<CrmApp />} />

        {/* Fallback to Stage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
