import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Brain, TrendingUp, Heart, Lightbulb } from 'lucide-react';
import { useHSJ } from '../../../lib/manifest';

export function CognitiveInsights() {
  const { healthData } = useHSJ();
  const thoughts = healthData?.cognitive?.thoughts || [];

  // Get pattern frequencies
  const patternFrequencies = thoughts.reduce((acc: Record<string, number>, thought) => {
    thought.patterns.forEach(pattern => {
      acc[pattern] = (acc[pattern] || 0) + 1;
    });
    return acc;
  }, {});

  // Get emotion frequencies and intensities
  const emotions = thoughts.reduce((acc: Record<string, {
    count: number;
    totalIntensity: number;
    intensities: number[];
  }>, thought) => {
    const emotion = thought.emotion;
    if (!acc[emotion]) {
      acc[emotion] = {
        count: 0,
        totalIntensity: 0,
        intensities: []
      };
    }
    acc[emotion].count++;
    acc[emotion].totalIntensity += thought.intensity;
    acc[emotion].intensities.push(thought.intensity);
    return acc;
  }, {});

  // Calculate average intensities and variations
  const emotionalInsights = Object.entries(emotions).map(([emotion, data]) => ({
    emotion,
    count: data.count,
    avgIntensity: Math.round(data.totalIntensity / data.count),
    variation: Math.round(
      Math.sqrt(
        data.intensities.reduce((sum, i) => 
          sum + Math.pow(i - data.totalIntensity / data.count, 2), 0
        ) / data.count
      )
    )
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Pattern Analysis */}
      <Card className="bg-black/30 backdrop-blur border-none">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Thought Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(patternFrequencies).map(([pattern, count]) => (
              <div 
                key={pattern}
                className="flex items-center justify-between p-3 bg-white/10 rounded-lg"
              >
                <span className="text-white">{pattern}</span>
                <span className="text-white/60">{count}x</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emotional Landscape */}
      <Card className="bg-black/30 backdrop-blur border-none">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Emotional Landscape
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emotionalInsights.map(({ emotion, count, avgIntensity, variation }) => (
              <div 
                key={emotion}
                className="space-y-2"
              >
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-white">{emotion}</span>
                  </div>
                  <span className="text-white/60">{count}x</span>
                </div>
                <div className="ml-4 text-sm text-white/60">
                  Average intensity: {avgIntensity}
                  {variation > 10 && ' (Variable)'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Growth Journey */}
      <Card className="bg-black/30 backdrop-blur border-none">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {thoughts.length > 0 ? (
              <div className="flex items-start gap-2 p-3 bg-white/10 rounded-lg">
                <Lightbulb className="h-5 w-5 text-yellow-400 mt-1" />
                <div className="space-y-2">
                  <p className="text-white/80">
                    You've explored {thoughts.length} moments of reflection, discovering patterns in your thoughts and emotions.
                  </p>
                  <p className="text-white/60">
                    Your most common emotion is {
                      Object.entries(emotions).sort((a, b) => b[1].count - a[1].count)[0][0]
                    }, experienced {
                      Object.entries(emotions).sort((a, b) => b[1].count - a[1].count)[0][1].count
                    } times.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-white/60">
                Begin your journey of self-discovery by sharing your thoughts and feelings.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis */}
      {healthData?.cognitive?.analysis && (
        <Card className="bg-black/30 backdrop-blur border-none">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {healthData.cognitive.analysis.insights.map((insight, index) => (
                <div key={index} className="p-4 bg-white/10 rounded-lg text-white">
                  {insight}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
