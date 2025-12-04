
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { CampaignEditorHub } from '@/components/campaign/CampaignEditorHub';

const CampaignEditorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const campaignPackage = location.state?.campaignPackage;

  useEffect(() => {
    if (!campaignPackage) {
      console.error('No campaign package found in navigation state');
      navigate('/content-workshop');
    }
  }, [campaignPackage, navigate]);

  if (!campaignPackage) {
    return null;
  }

  return <CampaignEditorHub campaignPackage={campaignPackage} />;
};

export default CampaignEditorPage;
