import { useNavigate } from "react-router-dom";
import IntakeFlow from "@/components/intake/IntakeFlow";

const IntakeFlowPage = () => {
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };
  
  return <IntakeFlow onClose={handleClose} />;
};

export default IntakeFlowPage;