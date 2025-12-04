import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Info, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const GeneratedChart = ({
  configuration,
  title,
  description,
  showInsights = true,
  showDisclaimers = true,
  onExport,
  onShare,
}) => {
  const { chartConfig, insights, accessibility } = configuration;

  const renderChart = () => {
    const commonProps = {
      data: chartConfig.data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 },
    };

    const xAxisProps = {
      dataKey: chartConfig.xAxis.dataKey,
      label: { value: chartConfig.xAxis.label, position: 'insideBottom', offset: -10 },
    };

    const yAxisProps = {
      label: { value: chartConfig.yAxis.label, angle: -90, position: 'insideLeft' },
      domain: chartConfig.yAxis.domain,
    };

    switch (chartConfig.type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {chartConfig.grid?.show && (
              <CartesianGrid strokeDasharray={chartConfig.grid.strokeDasharray || '3 3'} className="stroke-muted" />
            )}
            <XAxis {...xAxisProps} className="text-xs fill-foreground" />
            <YAxis {...yAxisProps} className="text-xs fill-foreground" />
            {chartConfig.tooltip?.show && <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />}
            {chartConfig.legend?.show && <Legend />}
            {chartConfig.annotations?.map((annotation, idx) => (
              <ReferenceLine
                key={idx}
                y={annotation.value}
                label={annotation.label}
                stroke={annotation.color}
                strokeDasharray="3 3"
              />
            ))}
            {chartConfig.series.map((series, idx) => (
              <Bar
                key={idx}
                dataKey={series.dataKey}
                name={series.name}
                fill={series.color}
                radius={[8, 8, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            {chartConfig.grid?.show && (
              <CartesianGrid strokeDasharray={chartConfig.grid.strokeDasharray || '3 3'} className="stroke-muted" />
            )}
            <XAxis {...xAxisProps} className="text-xs fill-foreground" />
            <YAxis {...yAxisProps} className="text-xs fill-foreground" />
            {chartConfig.tooltip?.show && <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />}
            {chartConfig.legend?.show && <Legend />}
            {chartConfig.annotations?.map((annotation, idx) => (
              <ReferenceLine
                key={idx}
                y={annotation.value}
                label={annotation.label}
                stroke={annotation.color}
                strokeDasharray="3 3"
              />
            ))}
            {chartConfig.series.map((series, idx) => (
              <Line
                key={idx}
                type="monotone"
                dataKey={series.dataKey}
                name={series.name}
                stroke={series.color}
                strokeWidth={2}
                dot={{ fill: series.color, r: 4 }}
              />
            ))}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {chartConfig.grid?.show && (
              <CartesianGrid strokeDasharray={chartConfig.grid.strokeDasharray || '3 3'} className="stroke-muted" />
            )}
            <XAxis {...xAxisProps} className="text-xs fill-foreground" />
            <YAxis {...yAxisProps} className="text-xs fill-foreground" />
            {chartConfig.tooltip?.show && <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />}
            {chartConfig.legend?.show && <Legend />}
            {chartConfig.series.map((series, idx) => (
              <Area
                key={idx}
                type="monotone"
                dataKey={series.dataKey}
                name={series.name}
                stroke={series.color}
                fill={series.color}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chartConfig.data}
              dataKey={chartConfig.series[0]?.dataKey || 'value'}
              nameKey={chartConfig.xAxis.dataKey}
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {chartConfig.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartConfig.colors[index % chartConfig.colors.length]} />
              ))}
            </Pie>
            {chartConfig.tooltip?.show && <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />}
            {chartConfig.legend?.show && <Legend />}
          </PieChart>
        );

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            {chartConfig.grid?.show && (
              <CartesianGrid strokeDasharray={chartConfig.grid.strokeDasharray || '3 3'} className="stroke-muted" />
            )}
            <XAxis {...xAxisProps} className="text-xs fill-foreground" type="number" />
            <YAxis {...yAxisProps} className="text-xs fill-foreground" type="number" />
            {chartConfig.tooltip?.show && <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />}
            {chartConfig.legend?.show && <Legend />}
            {chartConfig.series.map((series, idx) => (
              <Scatter
                key={idx}
                name={series.name}
                data={chartConfig.data}
                fill={series.color}
              />
            ))}
          </ScatterChart>
        );

      default:
        return <div className="text-muted-foreground">Unsupported chart type</div>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
            {accessibility.colorBlindSafe && (
              <Badge variant="secondary" className="mt-2">
                <Info className="w-3 h-3 mr-1" />
                Color Blind Safe
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="w-4 h-4" />
              </Button>
            )}
            {onShare && (
              <Button variant="outline" size="sm" onClick={onShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chart */}
        <div role="img" aria-label={accessibility.altText}>
          <ResponsiveContainer width="100%" height={400}>
            {renderChart()}
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        {showInsights && insights && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Summary</h4>
              <p className="text-sm text-muted-foreground">{insights.summary}</p>
            </div>

            {insights.keyFindings.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Key Findings</h4>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  {insights.keyFindings.map((finding, idx) => (
                    <li key={idx}>{finding}</li>
                  ))}
                </ul>
              </div>
            )}

            {insights.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Recommendations</h4>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  {insights.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Disclaimers */}
        {showDisclaimers && insights.disclaimers.length > 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {insights.disclaimers.map((disclaimer, idx) => (
                <p key={idx} className="mt-1">{disclaimer}</p>
              ))}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};