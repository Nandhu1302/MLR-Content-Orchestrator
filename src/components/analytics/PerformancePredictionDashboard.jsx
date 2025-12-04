import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  CheckCircle, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Zap,
  Brain,
  Users,
  Award,
  Clock
} from "lucide-react";
import { PerformancePredictionService } from "@/services/performancePredictionService";

export const PerformancePredictionDashboard = ({
  content,
  brandId,
  context,
  complianceScore,
  onPredictionComplete
}) => {
  const [predictions, setPredictions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (content && content.trim().length > 20 && brandId) {
      generatePredictions();
    }
  }, [content, brandId, complianceScore]);

  const generatePredictions = async () => {
    if (!content || content.trim().length < 20) {
      setError('Content too short for analysis');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await PerformancePredictionService.predictPerformance(
        content,
        brandId,
        context,
        complianceScore
      );
      setPredictions(result);
      onPredictionComplete?.(result);
    } catch (err) {
      console.error('Prediction generation failed:', err);
      setError('Failed to generate predictions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const getConfidenceIcon = (confidence) => {
    if (confidence >= 80) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (confidence >= 60) return <Target className="w-4 h-4 text-yellow-600" />;
    return <AlertTriangle className="w-4 h-4 text-red-600" />;
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 animate-pulse" />
            Performance Prediction Engine
          </CardTitle>
          <CardDescription>
            Analyzing content and generating performance predictions...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 animate-spin" />
            <span>Generating predictions...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!predictions) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <BarChart className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Enter content to see performance predictions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overall Prediction Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Performance Predictions
            </div>
            <Badge variant={getScoreBadgeVariant(predictions.overall_confidence)}>
              {predictions.overall_confidence}% confidence
            </Badge>
          </CardTitle>
          <CardDescription>
            AI-powered performance predictions based on content analysis and historical data
            {predictions.processing_time && (
              <span className="ml-2 text-xs">
                • Generated in {predictions.processing_time}ms
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Award className="w-4 h-4" />
                <span className="text-sm font-medium">MLR Approval</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(predictions.mlr_approval.predicted_score)}`}>
                {predictions.mlr_approval.predicted_score}%
              </div>
              <div className="text-xs text-muted-foreground">
                {predictions.mlr_approval.confidence_level}% confidence
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Engagement</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(predictions.engagement_forecast.predicted_score)}`}>
                {predictions.engagement_forecast.predicted_score}%
              </div>
              <div className="text-xs text-muted-foreground">
                {predictions.engagement_forecast.confidence_level}% confidence
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Risk Score</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(100 - predictions.risk_assessment.predicted_score)}`}>
                {predictions.risk_assessment.predicted_score}%
              </div>
              <div className="text-xs text-muted-foreground">
                {predictions.risk_assessment.confidence_level}% confidence
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">A/B Potential</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(predictions.ab_recommendations.predicted_score)}`}>
                {predictions.ab_recommendations.predicted_score}%
              </div>
              <div className="text-xs text-muted-foreground">
                {predictions.ab_recommendations.confidence_level}% confidence
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Predictions */}
      <Tabs defaultValue="mlr" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mlr">MLR Approval</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          <TabsTrigger value="ab">A/B Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="mlr" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                MLR Approval Prediction
                {getConfidenceIcon(predictions.mlr_approval.confidence_level)}
              </CardTitle>
              <CardDescription>
                Likelihood of regulatory approval based on content analysis and historical patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Approval Likelihood</span>
                  <span className={getScoreColor(predictions.mlr_approval.predicted_score)}>
                    {predictions.mlr_approval.predicted_score}%
                  </span>
                </div>
                <Progress value={predictions.mlr_approval.predicted_score} className="h-3" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-green-600">Positive Indicators</h4>
                  <ul className="space-y-2">
                    {predictions.mlr_approval.prediction_factors.positive_indicators.map((indicator, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-red-600">Risk Indicators</h4>
                  <ul className="space-y-2">
                    {predictions.mlr_approval.prediction_factors.risk_indicators.map((indicator, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Key Factors</h4>
                <div className="flex flex-wrap gap-2">
                  {predictions.mlr_approval.prediction_factors.key_factors.map((factor, index) => (
                    <Badge key={index} variant="outline">
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>

              {predictions.mlr_approval.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Recommendations</h4>
                  <ul className="space-y-2">
                    {predictions.mlr_approval.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Engagement Forecast
                {getConfidenceIcon(predictions.engagement_forecast.confidence_level)}
              </CardTitle>
              <CardDescription>
                Predicted audience engagement based on content characteristics and historical performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Expected Engagement Rate</span>
                  <span className={getScoreColor(predictions.engagement_forecast.predicted_score)}>
                    {predictions.engagement_forecast.predicted_score}%
                  </span>
                </div>
                <Progress value={predictions.engagement_forecast.predicted_score} className="h-3" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-green-600">Engagement Drivers</h4>
                  <ul className="space-y-2">
                    {predictions.engagement_forecast.prediction_factors.positive_indicators.map((indicator, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-yellow-600">Potential Issues</h4>
                  <ul className="space-y-2">
                    {predictions.engagement_forecast.prediction_factors.risk_indicators.map((indicator, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {predictions.engagement_forecast.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Optimization Recommendations</h4>
                  <ul className="space-y-2">
                    {predictions.engagement_forecast.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Risk Assessment
                {getConfidenceIcon(predictions.risk_assessment.confidence_level)}
              </CardTitle>
              <CardDescription>
                Comprehensive risk analysis for regulatory compliance and brand safety
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Risk Level</span>
                  <span className={getScoreColor(100 - predictions.risk_assessment.predicted_score)}>
                    {predictions.risk_assessment.predicted_score > 70 ? 'High' :
                     predictions.risk_assessment.predicted_score > 40 ? 'Medium' : 'Low'}
                  </span>
                </div>
                <Progress 
                  value={predictions.risk_assessment.predicted_score} 
                  className="h-3"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-green-600">Risk Mitigators</h4>
                  <ul className="space-y-2">
                    {predictions.risk_assessment.prediction_factors.positive_indicators.map((indicator, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-red-600">Risk Factors</h4>
                  <ul className="space-y-2">
                    {predictions.risk_assessment.prediction_factors.risk_indicators.map((indicator, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {predictions.risk_assessment.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Risk Mitigation</h4>
                  <ul className="space-y-2">
                    {predictions.risk_assessment.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ab" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                A/B Testing Recommendations
                {getConfidenceIcon(predictions.ab_recommendations.confidence_level)}
              </CardTitle>
              <CardDescription>
                Strategic recommendations for optimizing content through A/B testing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Testing Potential</span>
                  <span className={getScoreColor(predictions.ab_recommendations.predicted_score)}>
                    {predictions.ab_recommendations.predicted_score}%
                  </span>
                </div>
                <Progress value={predictions.ab_recommendations.predicted_score} className="h-3" />
              </div>

              <div>
                <h4 className="font-medium mb-3">Testing Opportunities</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {predictions.ab_recommendations.prediction_factors.positive_indicators.map((indicator, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{indicator}</span>
                    </div>
                  ))}
                </div>
              </div>

              {predictions.ab_recommendations.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Recommended Tests</h4>
                  <ul className="space-y-3">
                    {predictions.ab_recommendations.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <Zap className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-3">Key Factors</h4>
                <div className="flex flex-wrap gap-2">
                  {predictions.ab_recommendations.prediction_factors.key_factors.map((factor, index) => (
                    <Badge key={index} variant="outline">
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};