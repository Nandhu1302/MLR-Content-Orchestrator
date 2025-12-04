import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Send } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const DesignHandoffModal = ({
  isOpen,
  onClose,
  variation,
  asset,
  onHandoffCreated
}) => {
  const navigate = useNavigate();
  const [priority, setPriority] = useState('medium');
  const [deadline, setDeadline] = useState();
  const [designNotes, setDesignNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!deadline) {
      toast({
        title: "Deadline Required",
        description: "Please select a deadline for the design handoff.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data: handoff, error } = await supabase
        .from('design_handoffs')
        .insert({
          asset_id: asset.id,
          project_id: asset.project_id,
          brand_id: asset.brand_id,
          handoff_status: 'pending',
          content_context: {
            variation_id: variation.id,
            variation_name: variation.variation_name,
            base_content: variation.content_data,
            target_context: variation.target_context,
            personalization_factors: variation.personalization_factors
          },
          design_requirements: {
            priority,
            deadline: deadline.toISOString(),
            notes: designNotes,
            asset_type: asset.asset_type
          },
          brand_context: {},
          compliance_requirements: {},
          design_assets: {},
          feedback: {},
          timeline: {
            requested_at: new Date().toISOString(),
            deadline: deadline.toISOString()
          },
          handed_off_by: user.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sent to Design",
        description: `"${variation.variation_name}" has been sent to the design team.`
      });

      // Navigate to Design Studio with the handoff ID using React Router
      navigate(`/design-studio?handoff=${handoff.id}`);

      onHandoffCreated();
      onClose();
    } catch (error) {
      console.error('Error creating design handoff:', error);
      toast({
        title: "Handoff Failed",
        description: "Failed to send to design team. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send to Design Team</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Variation Info */}
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium">{variation.variation_name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {variation.target_context?.description || 'No description'}
            </p>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label>Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, 'PPP') : 'Select deadline'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Design Notes */}
          <div className="space-y-2">
            <Label>Design Notes</Label>
            <Textarea
              placeholder="Add any specific design requirements, preferences, or notes..."
              value={designNotes}
              onChange={(e) => setDesignNotes(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Sending...' : 'Send to Design'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};