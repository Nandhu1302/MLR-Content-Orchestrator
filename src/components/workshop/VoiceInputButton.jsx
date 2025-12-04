
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

/*
interface VoiceInputButtonProps {
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
}
*/

export const VoiceInputButton = ({ onTranscript, disabled } /*: VoiceInputButtonProps*/) => {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [browserSupported, setBrowserSupported] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const recognitionRef = useRef/*<any>*/(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check browser support on mount
    if (!('webkitSpeechRecognition' in window)) {
      setBrowserSupported(false);
    }
  }, []);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissionDenied(false);
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setPermissionDenied(true);
      toast({
        title: 'Microphone Access Required',
        description: 'Please allow microphone access to use voice input.',
        variant: 'destructive'
      });
      return false;
    }
  };

  const startListening = async () => {
    if (!browserSupported) {
      toast({
        title: 'Voice input not supported',
        description: 'Your browser does not support voice input. Please use Chrome or Edge, or type your story.',
        variant: 'destructive'
      });
      return;
    }

    // Request microphone permission first
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) return;

    try {
      const SpeechRecognition = window.webkitSpeechRecognition; /* (window as any).webkitSpeechRecognition */
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = true; // Enable interim results for preview
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setInterimTranscript('');
      };

      recognition.onresult = (event /*: any*/) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        if (interim) {
          setInterimTranscript(interim);
        }

        if (final) {
          onTranscript(final);
          setInterimTranscript('');
          setIsListening(false);
        }
      };

      recognition.onerror = (event /*: any*/) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setInterimTranscript('');
        
        if (event.error === 'not-allowed') {
          setPermissionDenied(true);
          toast({
            title: 'Microphone access denied',
            description: 'Please allow microphone access in your browser settings.',
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Voice input error',
            description: 'Failed to capture voice input. Please try again.',
            variant: 'destructive'
          });
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      toast({
        title: 'Voice input error',
        description: 'Failed to start voice input. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setInterimTranscript('');
    }
  };

  // Show browser not supported message
  if (!browserSupported) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Voice input is not supported in your browser. Please use <strong>Chrome</strong> or <strong>Edge</strong>, or type your story below.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant={isListening ? 'destructive' : 'outline'}
        size="icon"
        onClick={isListening ? stopListening : startListening}
        disabled={disabled || permissionDenied}
        className={isListening ? 'animate-pulse' : ''}
      >
        {isListening ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
      
      {/* Show interim transcript preview */}
      {interimTranscript && (
        <div className="text-sm text-muted-foreground italic p-2 bg-muted rounded">
          Listening: "{interimTranscript}"
        </div>
      )}
      
      {permissionDenied && (
        <p className="text-xs text-destructive">
          Microphone access denied. Please enable it in browser settings.
        </p>
      )}
    </div>
  );
};
