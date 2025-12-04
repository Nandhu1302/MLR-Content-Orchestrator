
import { useState } from 'react';
import { ArrowLeft, Play, CheckCircle2, XCircle, AlertCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// ----- Removed TypeScript interfaces: TestScenario, BehaviorValidation, TurnJudgment, DataQualityCheck -----

const testScenarios = [
  {
    id: 'vague-input',
    name: 'Vague Input Test',
    description: 'User provides minimal information',
    userInput: 'I need some content for an event',
    expectedIntent: {
      occasion: 'event'
    },
    expectedBehavior: [
      'Should NOT ask about occasion (already known)',
      'Should ask ONE clarifying question about audience or event details',
      'Should reference brand intelligence (market data, audience segments)',
      'Should NOT use generic language like "best practices"'
    ],
    expectedTools: ['query_brand_status'],
    followUpScenarios: [
      { label: 'Specify Audience', message: "It's for HIV specialists" },
      { label: 'Specify Event', message: "It's a medical conference in Chicago" },
      { label: 'Ask for Suggestion', message: 'What do you recommend?' }
    ]
  },
  {
    id: 'detailed-input',
    name: 'Detailed Story Test',
    description: 'User provides comprehensive story',
    userInput: 'I need materials for IDWeek in Chicago. Gilead has a booth on day 2 and a 15-minute podium presentation. Audience is KOLs and ID specialists focusing on HIV treatment updates.',
    expectedIntent: {
      occasion: 'event',
      audience: 'hcp-specialist',
      region: 'Midwest',
      activities: ['booth', 'podium']
    },
    expectedBehavior: [
      'Should extract: occasion=event, eventName=IDWeek, region=Midwest/Chicago, audience=KOL/ID Specialists, activities=[booth, podium]',
      'Should NOT ask about already-provided information',
      'Should immediately suggest asset types (booth materials, podium slides, follow-up email)',
      'Should reference success patterns for booth+podium combo',
      'Should mention predicted performance lift'
    ],
    expectedTools: ['query_audience_insights', 'suggest_multi_channel_approach'],
    followUpScenarios: [
      { label: 'Accept Suggestion', message: 'Yes, that sounds perfect' },
      { label: 'Request Changes', message: 'Actually, skip the email and focus on booth' },
      { label: 'Ask About Evidence', message: 'What claims should I use?' }
    ]
  },
  {
    id: 'disagreement',
    name: 'User Disagreement Test',
    description: 'User disagrees with AI suggestion',
    userInput: "Actually, I don't want email. Just booth materials.",
    expectedIntent: {},
    expectedBehavior: [
      'Should acknowledge user correction gracefully',
      'Should adjust recommendations without questioning user',
      'Should focus only on booth materials',
      'Should NOT push back on user decision'
    ],
    expectedTools: [],
    followUpScenarios: [
      { label: 'Confirm', message: "Perfect, let's proceed with that" },
      { label: 'Another Change', message: 'On second thought, add social posts too' }
    ]
  }
];

const WorkshopTestLab = () => {
  const navigate = useNavigate();
  const [selectedScenario, setSelectedScenario] = useState(testScenarios[0]);
  const [testRunning, setTestRunning] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [turnJudgments, setTurnJudgments] = useState([]);
  const [currentTurnValidations, setCurrentTurnValidations] = useState([]);
  const [followUpMessage, setFollowUpMessage] = useState('');
  const [activeTab, setActiveTab] = useState('scenario');

  const initializeBehaviorValidations = (behaviors) => {
    return behaviors.map((behavior) => ({
      behavior,
      passed: null,
      score: 3,
      notes: ''
    }));
  };

  const runTest = async (isFollowUp = false, customMessage) => {
    setTestRunning(true);
    const messageToSend = customMessage ?? (isFollowUp ? followUpMessage : selectedScenario.userInput);
    if (!isFollowUp) {
      setConversationHistory([]);
      setTurnJudgments([]);
      setCurrentTurnValidations(initializeBehaviorValidations(selectedScenario.expectedBehavior));
    }
    try {
      // Call story-consultant edge function
      const { data, error } = await supabase.functions.invoke('story-consultant', {
        body: {
          userMessage: messageToSend,
          conversationHistory: conversationHistory.map((msg) => ({
            role: msg.role,
            content: msg.content
          })),
          context: {
            userStory: selectedScenario.userInput,
            brandId: '225d6bbc-c663-462f-86a8-21886bc40047'
          }
        }
      });
      if (error) throw error;

      // Add to conversation history with tool results
      const newHistory = [
        ...conversationHistory,
        { role: 'user', content: messageToSend },
        {
          role: 'assistant',
          content: data.message,
          quickReplies: data.quickReplies,
          toolResults: data.toolResults ?? {},
          toolCalls: data.toolCalls ?? []
        }
      ];
      setConversationHistory(newHistory);

      // Initialize validations for this turn
      if (isFollowUp) {
        setCurrentTurnValidations(
          initializeBehaviorValidations([
            'Should acknowledge user input',
            'Should maintain conversation context',
            'Should provide relevant follow-up',
            'Should NOT repeat previous information'
          ])
        );
      }
      setFollowUpMessage('');
      setActiveTab('conversation');
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setTestRunning(false);
    }
  };

  const updateBehaviorValidation = (index, field, value) => {
    const updated = [...currentTurnValidations];
    updated[index] = { ...updated[index], [field]: value };
    setCurrentTurnValidations(updated);
  };

  const analyzeDataQuality = (toolResults, aiResponse) => {
    const checks = [];
    if (!toolResults) return checks;

    // Check query_brand_status
    if (toolResults.brandStatus) {
      const data = toolResults.brandStatus;
      const dataPoints = [];
      const hallucinations = [];

      // Check what data was returned
      if (data.marketShare) dataPoints.push(`Market Share: ${data.marketShare}%`);
      if (data.rxGrowth) dataPoints.push(`Rx Growth: ${data.rxGrowth}%`);
      if (data.topCompetitor && data.topCompetitor !== 'None') dataPoints.push(`Competitor: ${data.topCompetitor}`);

      // Check if AI referenced these specific numbers
      const referencedMarketShare = data.marketShare && aiResponse.includes(data.marketShare.toString());
      const referencedRxGrowth = data.rxGrowth && aiResponse.includes(data.rxGrowth.toString());
      const referencedInResponse = referencedMarketShare || referencedRxGrowth;

      // Check for hallucinated numbers (numbers in AI response not from data)
      const numbersInResponse = aiResponse.match(/\d+\.?\d*%/g) ?? [];
      numbersInResponse.forEach((num) => {
        if (!dataPoints.some((dp) => dp.includes(num))) {
          hallucinations.push(num);
        }
      });

      checks.push({
        toolName: 'query_brand_status',
        returnedData: dataPoints.length > 0,
        dataCount: dataPoints.length,
        dataQuality: dataPoints.length > 2 ? 'real' : dataPoints.length > 0 ? 'fallback' : 'empty',
        referencedInResponse,
        specificDataPoints: dataPoints,
        hallucinatedData: hallucinations
      });
    }

    // Check suggest_multi_channel_approach
    if (toolResults.multiChannelApproach) {
      const data = toolResults.multiChannelApproach;
      const dataPoints = [];
      if (data.patterns && data.patterns.length > 0) {
        dataPoints.push(`${data.patterns.length} success patterns found`);
        data.patterns.forEach((p) => {
          if (p.performanceLift) dataPoints.push(`${p.patternName}: +${p.performanceLift}% lift`);
        });
      }
      if (data.suggestedCombo) {
        dataPoints.push(`Suggested: ${data.suggestedCombo.channels?.join(' + ')}`);
        if (data.suggestedCombo.conversionLift) {
          dataPoints.push(`${data.suggestedCombo.conversionLift}x lift`);
        }
      }
      const referencedInResponse = dataPoints.some((dp) =>
        aiResponse.toLowerCase().includes(dp.toLowerCase().slice(0, 20))
      );
      checks.push({
        toolName: 'suggest_multi_channel_approach',
        returnedData: dataPoints.length > 0,
        dataCount: dataPoints.length,
        dataQuality: data.dataSource === 'success_patterns' ? 'real' : 'fallback',
        referencedInResponse,
        specificDataPoints: dataPoints,
        hallucinatedData: []
      });
    }

    return checks;
  };

  const saveCurrentTurnJudgment = () => {
    const lastMessage = conversationHistory[conversationHistory.length - 1];
    const toolResults = lastMessage?.toolResults ?? {};
    const aiResponse = lastMessage?.content ?? '';
    const dataQualityChecks = analyzeDataQuality(toolResults, aiResponse);

    const overallScore =
      currentTurnValidations.reduce((sum, v) => sum + v.score, 0) / currentTurnValidations.length;

    const passedCount = currentTurnValidations.filter((v) => v.passed === true).length;
    const status =
      passedCount === currentTurnValidations.length ? 'passed' : passedCount > 0 ? 'partial' : 'failed';

    const judgment = {
      turnNumber: turnJudgments.length + 1,
      userMessage: conversationHistory[conversationHistory.length - 2]?.content ?? '',
      aiResponse,
      status,
      behaviorValidations: currentTurnValidations,
      overallScore,
      toolResults,
      dataQualityChecks
    };

    setTurnJudgments([...turnJudgments, judgment]);
    setActiveTab('validation');
  };

  const getOverallTestScore = () => {
    if (turnJudgments.length === 0) return 0;
    const totalScore = turnJudgments.reduce((sum, j) => sum + j.overallScore, 0);
    return Math.round((totalScore / turnJudgments.length) * 20); // Convert to 100 scale
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/content-workshop')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Enhanced AI Test Lab</h1>
              <p className="text-muted-foreground mt-1">
                Manual behavior validation & multi-turn conversation testing
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            DEV ONLY
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Scenario Selector */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Test Scenarios</h3>
              <div className="space-y-2">
                {testScenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => {
                      setSelectedScenario(scenario);
                      setConversationHistory([]);
                      setTurnJudgments([]);
                      setCurrentTurnValidations([]);
                      setActiveTab('scenario');
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedScenario.id === scenario.id
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-muted border-border'
                    }`}
                  >
                    <div className="font-medium text-sm">{scenario.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {scenario.description}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Test Summary */}
            {turnJudgments.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Test Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Turns</span>
                    <span className="font-semibold">{turnJudgments.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Overall Score</span>
                    <Badge variant={getOverallTestScore() >= 70 ? "default" : "destructive"}>
                      {getOverallTestScore()}/100
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {turnJudgments.map((judgment, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            judgment.status === 'passed'
                              ? 'bg-green-600'
                              : judgment.status === 'partial'
                              ? 'bg-yellow-600'
                              : 'bg-red-600'
                          }`}
                        />
                        <span className="text-muted-foreground">Turn {judgment.turnNumber}</span>
                        <span className="ml-auto">{Math.round(judgment.overallScore)}/5</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Middle & Right: Test Details and Results */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="scenario">Scenario</TabsTrigger>
                <TabsTrigger value="conversation">
                  Conversation
                  {conversationHistory.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {Math.floor(conversationHistory.length / 2)}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="tool-results">Tool Results</TabsTrigger>
                <TabsTrigger value="validation">
                  Validation
                  {turnJudgments.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {turnJudgments.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="scenario" className="space-y-4">
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-4">{selectedScenario.name}</h3>
                  <p className="text-muted-foreground mb-4">{selectedScenario.description}</p>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-2">User Input:</div>
                      <div className="p-3 bg-muted rounded-lg text-sm">
                        {selectedScenario.userInput}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Expected Behaviors to Validate:</div>
                      <ul className="space-y-1">
                        {selectedScenario.expectedBehavior.map((behavior, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>{behavior}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {selectedScenario.expectedTools && (
                      <div>
                        <div className="text-sm font-medium mb-2">Expected Tool Calls:</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedScenario.expectedTools.map((tool) => (
                            <Badge key={tool} variant="secondary">{tool}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => runTest(false)}
                    disabled={testRunning}
                    className="w-full mt-6"
                  >
                    {testRunning ? (
                      <>Running Test...</>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Test
                      </>
                    )}
                  </Button>
                </Card>
              </TabsContent>

              <TabsContent value="conversation" className="space-y-4">
                <Card className="p-6">
                  {conversationHistory.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Run a test to start conversation</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Conversation Messages */}
                      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {conversationHistory.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`p-4 rounded-lg ${
                              msg.role === 'user'
                                ? 'bg-primary/10 ml-8'
                                : 'bg-muted mr-8'
                            }`}
                          >
                            <div className="text-xs font-medium mb-2 uppercase text-muted-foreground">
                              {msg.role}
                            </div>
                            <div className="text-sm whitespace-pre-wrap">{msg.content}</div>

                            {msg.quickReplies && msg.quickReplies.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {msg.quickReplies.map((reply, ridx) => (
                                  <Button
                                    key={ridx}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => runTest(true, reply.value)}
                                    className="text-xs"
                                  >
                                    {reply.label}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Manual Behavior Validation for Current Turn */}
                      {conversationHistory.length > 0 && currentTurnValidations.length > 0 && (
                        <div className="border-t pt-6">
                          <h4 className="font-semibold mb-4 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            Manual Behavior Validation
                          </h4>
                          <div className="space-y-4">
                            {currentTurnValidations.map((validation, idx) => (
                              <div key={idx} className="p-4 border rounded-lg space-y-3">
                                <div className="flex items-start gap-3">
                                  <Checkbox
                                    checked={validation.passed === true}
                                    onCheckedChange={(checked) =>
                                      updateBehaviorValidation(idx, 'passed', checked)
                                    }
                                    className="mt-1"
                                  />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{validation.behavior}</p>
                                  </div>
                                </div>
                                <div className="pl-7 space-y-3">
                                  <div>
                                    <label className="text-xs text-muted-foreground mb-2 block">
                                      Quality Score: {validation.score}/5
                                    </label>
                                    <Slider
                                      value={[validation.score]}
                                      onValueChange={([value]) =>
                                        updateBehaviorValidation(idx, 'score', value)
                                      }
                                      min={1}
                                      max={5}
                                      step={1}
                                      className="w-full"
                                    />
                                  </div>
                                  <Textarea
                                    placeholder="Add notes about this behavior (optional)"
                                    value={validation.notes}
                                    onChange={(e) =>
                                      updateBehaviorValidation(idx, 'notes', e.target.value)
                                    }
                                    className="text-xs min-h-[60px]"
                                  />
                                </div>
                              </div>
                            ))}
                            <Button
                              onClick={saveCurrentTurnJudgment}
                              className="w-full"
                              variant="default"
                            >
                              Save Turn Validation & Continue
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Follow-up Message Input */}
                      <div className="border-t pt-6">
                        <h4 className="font-semibold mb-3">Send Follow-up Message</h4>

                        {/* Quick Follow-ups */}
                        {selectedScenario.followUpScenarios && (
                          <div className="mb-3">
                            <p className="text-xs text-muted-foreground mb-2">Quick Follow-ups:</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedScenario.followUpScenarios.map((followUp, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => runTest(true, followUp.message)}
                                  disabled={testRunning}
                                >
                                  {followUp.label}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Custom Message */}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Type a custom follow-up message..."
                            value={followUpMessage}
                            onChange={(e) => setFollowUpMessage(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey && followUpMessage.trim()) {
                                e.preventDefault();
                                runTest(true);
                              }
                            }}
                            disabled={testRunning}
                          />
                          <Button
                            onClick={() => runTest(true)}
                            disabled={testRunning || !followUpMessage.trim()}
                            size="icon"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </TabsContent>

              {/* Tool Results Tab */}
              <TabsContent value="tool-results" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Tool Results & Data Quality</h3>
                  {conversationHistory.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Run a test to see tool results</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {conversationHistory
                        .filter((msg) => msg.role === 'assistant' && msg.toolResults)
                        .map((msg, idx) => {
                          const toolResults = msg.toolResults ?? {};
                          return (
                            <div key={idx} className="border-l-2 border-primary/20 pl-4 space-y-4">
                              <h4 className="font-medium text-sm">Turn {idx + 1} Tool Calls</h4>

                              {/* Brand Status Results */}
                              {toolResults.brandStatus && (
                                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h5 className="font-medium text-sm">query_brand_status</h5>
                                    <Badge variant="outline">
                                      {Object.keys(toolResults.brandStatus).length} fields
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div>
                                      <span className="text-muted-foreground">Market Share:</span>
                                      <span className="ml-2 font-mono">{toolResults.brandStatus.marketShare}%</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Rx Growth:</span>
                                      <span className="ml-2 font-mono">{toolResults.brandStatus.rxGrowth}%</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Top Competitor:</span>
                                      <span className="ml-2 font-mono">{toolResults.brandStatus.topCompetitor}</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Top Region:</span>
                                      <span className="ml-2 font-mono">{toolResults.brandStatus.topRegion}</span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Multi-Channel Approach Results */}
                              {toolResults.multiChannelApproach && (
                                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h5 className="font-medium text-sm">suggest_multi_channel_approach</h5>
                                    <Badge variant="outline">
                                      {toolResults.multiChannelApproach.patterns?.length ?? 0} patterns
                                    </Badge>
                                  </div>
                                  {toolResults.multiChannelApproach.suggestedCombo && (
                                    <div className="text-xs space-y-2">
                                      <div>
                                        <span className="text-muted-foreground">Suggested Channels:</span>
                                        <span className="ml-2 font-mono">
                                          {toolResults.multiChannelApproach.suggestedCombo.channels?.join(' + ')}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Predicted Lift:</span>
                                        <span className="ml-2 font-mono">
                                          {toolResults.multiChannelApproach.suggestedCombo.conversionLift}x
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Data Source:</span>
                                        <Badge
                                          variant={
                                            toolResults.multiChannelApproach.dataSource === 'success_patterns'
                                              ? 'default'
                                              : 'secondary'
                                          }
                                          className="ml-2 text-xs"
                                        >
                                          {toolResults.multiChannelApproach.dataSource}
                                        </Badge>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Audience Insights Results */}
                              {toolResults.audienceInsights && (
                                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h5 className="font-medium text-sm">query_audience_insights</h5>
                                    <Badge variant="outline">
                                      {toolResults.audienceInsights.segmentName}
                                    </Badge>
                                  </div>
                                  <div className="text-xs space-y-1">
                                    <div>
                                      <span className="text-muted-foreground">Decision Factors:</span>
                                      <span className="ml-2 font-mono">
                                        {toolResults.audienceInsights.decisionFactors?.length ?? 0}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Channel Preferences:</span>
                                      <span className="ml-2 font-mono">
                                        {toolResults.audienceInsights.channelPreferences?.length ?? 0}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="validation" className="space-y-4">
                <Card className="p-6">
                  {turnJudgments.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Complete behavior validations to see results</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Overall Score */}
                      <div className="flex items-center justify-between pb-4 border-b">
                        <div>
                          <h3 className="font-semibold">Test Results</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {turnJudgments.length} turn{turnJudgments.length !== 1 ? 's' : ''} validated
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold">{getOverallTestScore()}</div>
                          <div className="text-xs text-muted-foreground">Overall Score</div>
                        </div>
                      </div>

                      {/* Per-Turn Judgments */}
                      <div className="space-y-4">
                        {turnJudgments.map((judgment, idx) => (
                          <div key={idx} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    judgment.status === 'passed'
                                      ? 'default'
                                      : judgment.status === 'partial'
                                      ? 'secondary'
                                      : 'destructive'
                                  }
                                >
                                  Turn {judgment.turnNumber}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  Score: {Math.round(judgment.overallScore)}/5
                                </span>
                              </div>
                              {judgment.status === 'passed' && (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              )}
                              {judgment.status === 'partial' && (
                                <AlertCircle className="h-5 w-5 text-yellow-600" />
                              )}
                              {judgment.status === 'failed' && (
                                <XCircle className="h-5 w-5 text-red-600" />
                              )}
                            </div>

                            <div className="text-sm space-y-2 mb-3">
                              <div className="p-2 bg-primary/5 rounded">
                                <span className="text-xs text-muted-foreground">User:</span>
                                <p className="mt-1">{judgment.userMessage}</p>
                              </div>
                              <div className="p-2 bg-muted rounded">
                                <span className="text-xs text-muted-foreground">AI:</span>
                                <p className="mt-1">{judgment.aiResponse.substring(0, 150)}...</p>
                              </div>
                            </div>

                            {/* Data Quality Checks */}
                            {judgment.dataQualityChecks && judgment.dataQualityChecks.length > 0 && (
                              <div className="mt-3 p-3 bg-muted/50 rounded-lg space-y-2">
                                <h5 className="text-xs font-semibold uppercase text-muted-foreground">
                                  Data Quality
                                </h5>
                                {judgment.dataQualityChecks.map((check, cIdx) => (
                                  <div key={cIdx} className="text-xs space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="font-mono">{check.toolName}</span>
                                      <div className="flex items-center gap-2">
                                        <Badge
                                          variant={check.dataQuality === 'real' ? 'default' : 'secondary'}
                                          className="text-xs"
                                        >
                                          {check.dataQuality}
                                        </Badge>
                                        {check.referencedInResponse ? (
                                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                                        ) : (
                                          <AlertCircle className="h-3 w-3 text-yellow-600" />
                                        )}
                                      </div>
                                    </div>

                                    {check.specificDataPoints.length > 0 && (
                                      <div className="pl-2 text-muted-foreground">
                                        <span className="text-xs">
                                          Returned: {check.specificDataPoints.slice(0, 2).join(', ')}
                                        </span>
                                      </div>
                                    )}

                                    {check.hallucinatedData.length > 0 && (
                                      <div className="pl-2 text-red-600">
                                        <span className="text-xs">
                                          ⚠️ Hallucinated: {check.hallucinatedData.join(', ')}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="space-y-2">
                              {judgment.behaviorValidations.map((validation, vidx) => (
                                <div key={vidx} className="flex items-start gap-2 text-xs">
                                  {validation.passed ? (
                                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5" />
                                  ) : (
                                    <XCircle className="h-3 w-3 text-red-600 mt-0.5" />
                                  )}
                                  <div className="flex-1">
                                    <p className="text-muted-foreground">{validation.behavior}</p>
                                    {validation.notes && (
                                      <p className="text-xs text-muted-foreground mt-1 italic">
                                        Note: {validation.notes}
                                      </p>
                                    )}
                                  </div>
                                  <span className="text-muted-foreground">{validation.score}/5</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopTestLab;
