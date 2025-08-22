/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Filters {
  experienceLevel: string;
  minScore: number;
  maxScore: number;
  location: string;
  skills: string[];
  minExperience: number;
  maxSalary: number;
  customFilters: Record<string, string>;
}

interface AdvancedFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  jobRequiredSkills: string[];
}

const allSkills = [
  'golang',
  'microservices',
  'docker',
  'kubernetes',
  'postgresql',
  'grpc',
  'rest-api',
  'aws',
  'gcp',
  'azure',
  'redis',
  'mongodb',
  'rabbitmq',
  'kafka',
  'prometheus',
  'grafana',
  'terraform',
  'jenkins',
];

const experienceLevels = [
  { value: 'all', label: 'All levels' },
  { value: 'junior', label: 'Junior (0-2 years)' },
  { value: 'mid', label: 'Mid-level (3-5 years)' },
  { value: 'senior', label: 'Senior (5+ years)' },
  { value: 'lead', label: 'Lead/Principal (8+ years)' },
];

// Predefined filter options for common fields
const predefinedFilterOptions = {
  religion: ['Islam', 'Christian', 'Hindu', 'Buddhism', 'Catholic', 'Other'],
  nationality: ['Indonesia', 'USA', 'Singapore', 'Malaysia', 'India', 'Other'],
  education: ['S1', 'S2', 'S3', 'D3', 'D4', 'High School'],
  languages: [
    'Indonesian',
    'English',
    'Mandarin',
    'Arabic',
    'Hindi',
    'Tamil',
    'Japanese',
    'Korean',
  ],
};

const commonFilterFields = [
  { value: 'religion', label: 'Religion' },
  { value: 'nationality', label: 'Nationality' },
  { value: 'education', label: 'Education' },
  { value: 'languages', label: 'Languages' },
];

export function AdvancedFilters({
  filters,
  onFiltersChange,
  jobRequiredSkills,
}: AdvancedFiltersProps) {
  const [newSkill, setNewSkill] = useState('');
  const [newFilterKey, setNewFilterKey] = useState('');
  const [newFilterValue, setNewFilterValue] = useState('');
  const [customFilterKey, setCustomFilterKey] = useState('');
  const [customFilterValue, setCustomFilterValue] = useState('');

  const updateFilter = (key: keyof Filters, value: any) => {
    // Handle special case for experience level
    if (key === 'experienceLevel' && value === 'all') {
      value = '';
    }

    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const addSkill = (skill: string) => {
    if (skill && !filters.skills.includes(skill)) {
      updateFilter('skills', [...filters.skills, skill]);
    }
    setNewSkill('');
  };

  const removeSkill = (skillToRemove: string) => {
    updateFilter(
      'skills',
      filters.skills.filter((skill) => skill !== skillToRemove),
    );
  };

  const addRequiredSkills = () => {
    const newSkills = jobRequiredSkills.filter((skill) => !filters.skills.includes(skill));
    updateFilter('skills', [...filters.skills, ...newSkills]);
  };

  const addPredefinedFilter = () => {
    if (newFilterKey && newFilterValue) {
      updateFilter('customFilters', {
        ...filters.customFilters,
        [newFilterKey]: newFilterValue,
      });
      setNewFilterKey('');
      setNewFilterValue('');
    }
  };

  const addCustomFilter = () => {
    if (customFilterKey && customFilterValue) {
      updateFilter('customFilters', {
        ...filters.customFilters,
        [customFilterKey]: customFilterValue,
      });
      setCustomFilterKey('');
      setCustomFilterValue('');
    }
  };

  const removeCustomFilter = (keyToRemove: string) => {
    const newCustomFilters = { ...filters.customFilters };
    delete newCustomFilters[keyToRemove];
    updateFilter('customFilters', newCustomFilters);
  };

  // Get current experience level value for display
  const getCurrentExperienceLevel = () => {
    return filters.experienceLevel === '' ? 'all' : filters.experienceLevel;
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Advanced Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Experience Level */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Experience Level</label>
          <Select
            value={getCurrentExperienceLevel()}
            onValueChange={(value) => updateFilter('experienceLevel', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent>
              {experienceLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Score Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Score Range: {filters.minScore}% - {filters.maxScore}%
          </label>
          <div className="px-2">
            <Slider
              value={[filters.minScore, filters.maxScore]}
              onValueChange={([min, max]) => {
                updateFilter('minScore', min);
                updateFilter('maxScore', max);
              }}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <Input
            placeholder="Enter location..."
            value={filters.location}
            onChange={(e) => updateFilter('location', e.target.value)}
          />
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Required Skills</label>
            <Button variant="outline" size="sm" onClick={addRequiredSkills} className="text-xs">
              Add Job Requirements
            </Button>
          </div>

          <div className="flex space-x-2">
            <Select value={newSkill} onValueChange={setNewSkill}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select skill..." />
              </SelectTrigger>
              <SelectContent>
                {allSkills
                  .filter((skill) => !filters.skills.includes(skill))
                  .map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => addSkill(newSkill)} disabled={!newSkill}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Selected Skills */}
          {filters.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center space-x-1">
                  <span>{skill}</span>
                  <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Years of Experience */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Minimum Experience: {filters.minExperience} years
          </label>
          <div className="px-2">
            <Slider
              value={[filters.minExperience]}
              onValueChange={([value]) => updateFilter('minExperience', value)}
              max={15}
              min={0}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Expected Salary */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Maximum Expected Salary (IDR)</label>
          <Input
            type="number"
            placeholder="e.g., 25000000"
            value={filters.maxSalary || ''}
            onChange={(e) => updateFilter('maxSalary', parseInt(e.target.value) || 0)}
          />
          {filters.maxSalary > 0 && (
            <p className="text-xs text-gray-500">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(filters.maxSalary)}
            </p>
          )}
        </div>

        <Separator />

        {/* Dynamic Custom Filters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Custom Filters</label>
            <p className="text-xs text-gray-500">Add specific criteria to filter candidates</p>
          </div>

          {/* Custom Key-Value Filters */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Custom Key-Value
            </label>
            <div className="flex space-x-2">
              <Input
                placeholder="Filter key (e.g., hobby)"
                value={customFilterKey}
                onChange={(e) => setCustomFilterKey(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Filter value (e.g., photography)"
                value={customFilterValue}
                onChange={(e) => setCustomFilterValue(e.target.value)}
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={addCustomFilter}
                disabled={!customFilterKey || !customFilterValue}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Create custom filters like &quot;agama: islam&quot;, &quot;hobi: fotografi&quot;,
              &quot;asal kota: bandung&quot;
            </p>
          </div>

          {/* Active Custom Filters */}
          {Object.keys(filters.customFilters).length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Active Custom Filters
              </label>
              <div className="space-y-2">
                {Object.entries(filters.customFilters).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {key}: {value}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomFilter(key)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Quick Filter Buttons */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Quick Filters</label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updateFilter('minScore', 90);
                updateFilter('experienceLevel', 'senior');
              }}
            >
              Top Performers
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updateFilter('skills', jobRequiredSkills);
              }}
            >
              Perfect Match
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updateFilter('location', 'Jakarta');
                updateFilter('maxSalary', 25000000);
              }}
            >
              Budget Friendly
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updateFilter('customFilters', { ...filters.customFilters, religion: 'islam' });
              }}
            >
              Muslim Candidates
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updateFilter('customFilters', {
                  ...filters.customFilters,
                  nationality: 'indonesia',
                });
              }}
            >
              Indonesian Only
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
