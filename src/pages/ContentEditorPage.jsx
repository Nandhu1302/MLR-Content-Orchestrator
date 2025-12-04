import { useParams, useNavigate } from "react-router-dom";
import ContentEditor from "@/components/content/ContentEditor";
import { ContentEditorErrorBoundary } from "@/components/content/ContentEditorErrorBoundary";

const ContentEditorPage = () => {
  const { assetId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/content-studio");
  };

  const handlePublishToDesign = () => {
    navigate("/design-studio");
  };

  if (!assetId) {
    navigate("/content-studio");
    return null;
  }

  return (
    <ContentEditorErrorBoundary onBack={handleBack}>
      <ContentEditor 
        assetId={assetId}
        onBack={handleBack}
        onPublishToDesign={handlePublishToDesign}
      />
    </ContentEditorErrorBoundary>
  );
};

export default ContentEditorPage;