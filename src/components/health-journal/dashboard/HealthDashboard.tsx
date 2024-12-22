import React, { useState } from 'react';
import { Plus, Calculator, Droplets, Apple, Activity, Download, Upload, User, Scale, Ruler } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Alert, AlertDescription } from '../../ui/alert';
import { BMICalculator, CalorieCalculator, FluidCalculator } from '../../../lib/calculators';

type CalculatorType = 'bmi' | 'calories' | 'fluid';

interface HealthDashboardProps {
  healthData: any;
  onUpdate: (section: string, data: any) => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function HealthDashboard({ 
  healthData, 
  onUpdate,
  onExport,
  onImport
}: HealthDashboardProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType | null>(null);
  const [calculatorError, setCalculatorError] = useState<string | null>(null);

  // Calculate age-based targets
  const calculateTargets = () => {
    const age = healthData?.profile?.age || 30;
    return {
      water: age < 65 ? 2000 : 1700, // ml per day
      protein: Math.round((age < 65 ? 0.8 : 1.0) * (healthData?.profile?.weight || 70)), // g per day
      activity: age < 65 ? 150 : 120, // minutes per week
    };
  };

  const targets = calculateTargets();

  const handleCalculate = () => {
    if (!healthData.profile) {
      setCalculatorError('Please update your profile details first');
      return;
    }

    try {
      const inputs = {
        age: healthData.profile.age,
        gender: healthData.profile.gender,
        weight: healthData.profile.weight,
        height: healthData.profile.height,
        activityLevel: healthData.profile.activityLevel,
        healthConditions: healthData.conditions?.map((c: any) => c.name) || [],
        medications: healthData.medications?.map((m: any) => m.name) || []
      };

      let result;
      switch (activeCalculator) {
        case 'bmi':
          result = new BMICalculator(inputs).calculate();
          break;
        case 'calories':
          result = new CalorieCalculator(inputs).calculate();
          break;
        case 'fluid':
          result = new FluidCalculator(inputs).calculate();
          break;
      }

      if (result && activeCalculator) {
        const updatedCalculators = {
          ...healthData.calculators,
          [activeCalculator]: {
            lastCalculated: new Date().toISOString(),
            values: result.values,
            targets: result.targets
          }
        };
        onUpdate('calculators', updatedCalculators);
      }

      setActiveCalculator(null);
    } catch (error) {
      console.error('Calculation error:', error);
      setCalculatorError('Failed to perform calculation');
    }
  };

  const handleProfileUpdate = (updates: any) => {
    onUpdate('profile', {
      ...healthData.profile,
      ...updates,
      lastUpdated: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-8">
      {/* Header with Actions */}
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold text-[#00CED1]">Health Dashboard</h2>
        <div className="flex gap-4">
          <Button 
            onClick={onExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Profile
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Health Profile</DialogTitle>
              </DialogHeader>
              <div className="p-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-upload">Select Profile File</Label>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    Choose File
                  </Button>
                  <input
                    id="profile-upload"
                    type="file"
                    ref={fileInputRef}
                    onChange={onImport}
                    accept=".json"
                    className="hidden"
                    aria-label="Choose profile file to import"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Block */}
        <Card className="bg-white/10 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Profile Details</span>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Plus className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={healthData?.profile?.age || ''}
                        onChange={(e) => handleProfileUpdate({ age: parseInt(e.target.value) })}
                        placeholder="Enter your age"
                        aria-label="Age in years"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Gender</Label>
                      <RadioGroup
                        value={healthData?.profile?.gender || 'male'}
                        onValueChange={(value) => handleProfileUpdate({ gender: value })}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female">Female</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={healthData?.profile?.weight || ''}
                        onChange={(e) => handleProfileUpdate({ weight: parseFloat(e.target.value) })}
                        placeholder="Enter your weight in kilograms"
                        aria-label="Weight in kilograms"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={healthData?.profile?.height || ''}
                        onChange={(e) => handleProfileUpdate({ height: parseFloat(e.target.value) })}
                        placeholder="Enter your height in centimeters"
                        aria-label="Height in centimeters"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Activity Level</Label>
                      <RadioGroup
                        value={healthData?.profile?.activityLevel || 'moderate'}
                        onValueChange={(value) => handleProfileUpdate({ activityLevel: value })}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sedentary" id="sedentary" />
                          <Label htmlFor="sedentary">Sedentary</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="light" id="light" />
                          <Label htmlFor="light">Light</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="moderate" id="moderate" />
                          <Label htmlFor="moderate">Moderate</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="active" id="active" />
                          <Label htmlFor="active">Active</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {healthData?.profile ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Age</span>
                    </div>
                    <span>{healthData.profile.age} years</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4" />
                      <span>Weight</span>
                    </div>
                    <span>{healthData.profile.weight} kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ruler className="w-4 h-4" />
                      <span>Height</span>
                    </div>
                    <span>{healthData.profile.height} cm</span>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">No profile details added yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Conditions Block */}
        <Card className="bg-white/10 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Conditions</span>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Plus className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {healthData?.conditions?.map((condition: any) => (
                <span key={condition.id} className="bg-[#00CED1]/20 px-2 py-1 rounded">
                  {condition.name}
                </span>
              )) || (
                <p className="text-gray-500">No conditions added yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Medications Block */}
        <Card className="bg-white/10 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Medications</span>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Plus className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {healthData?.medications?.map((med: any) => (
                <span key={med.id} className="bg-[#FFD700]/20 px-2 py-1 rounded">
                  {med.name}
                </span>
              )) || (
                <p className="text-gray-500">No medications added yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Daily Targets */}
        <Card className="bg-white/10 backdrop-blur">
          <CardHeader>
            <CardTitle>Daily Targets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                <span>Water</span>
              </div>
              <span>{targets.water}ml</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Apple className="w-5 h-5 text-green-500" />
                <span>Protein</span>
              </div>
              <span>{targets.protein}g</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-500" />
                <span>Activity</span>
              </div>
              <span>{targets.activity} min/week</span>
            </div>
          </CardContent>
        </Card>

        {/* Health Calculators */}
        <Card className="bg-white/10 backdrop-blur">
          <CardHeader>
            <CardTitle>Health Calculators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Dialog open={activeCalculator !== null} onOpenChange={(open) => !open && setActiveCalculator(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {activeCalculator === 'bmi' && 'BMI Calculator'}
                    {activeCalculator === 'calories' && 'Calorie Calculator'}
                    {activeCalculator === 'fluid' && 'Fluid Calculator'}
                  </DialogTitle>
                </DialogHeader>
                {calculatorError ? (
                  <Alert variant="destructive">
                    <AlertDescription>{calculatorError}</AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    <p>Using your profile data to calculate:</p>
                    <ul className="list-disc pl-4 space-y-2">
                      <li>Age: {healthData?.profile?.age || 'Not set'}</li>
                      <li>Weight: {healthData?.profile?.weight || 'Not set'} kg</li>
                      <li>Height: {healthData?.profile?.height || 'Not set'} cm</li>
                      <li>Activity Level: {healthData?.profile?.activityLevel || 'Not set'}</li>
                    </ul>
                    <Button onClick={handleCalculate} className="w-full">
                      Calculate
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setActiveCalculator('bmi')}
            >
              <Calculator className="w-4 h-4 mr-2" />
              BMI Calculator
              {healthData?.calculators?.bmi && (
                <span className="ml-auto text-sm opacity-70">
                  BMI: {healthData.calculators.bmi.values.bmi}
                </span>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setActiveCalculator('calories')}
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calorie Calculator
              {healthData?.calculators?.calories && (
                <span className="ml-auto text-sm opacity-70">
                  {healthData.calculators.calories.values.tdee} kcal
                </span>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setActiveCalculator('fluid')}
            >
              <Calculator className="w-4 h-4 mr-2" />
              Fluid Calculator
              {healthData?.calculators?.fluid && (
                <span className="ml-auto text-sm opacity-70">
                  {healthData.calculators.fluid.values.dailyFluidNeeds}L
                </span>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
