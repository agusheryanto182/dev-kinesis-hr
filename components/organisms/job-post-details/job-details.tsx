/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapPin, Calendar, DollarSign, Clock, Building } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmploymentTypeBadge } from '@/components/molecules/badge';
import { formatSalary } from '@/utils/format-salary/format-salary';

interface JobDetailsProps {
  job: any;
}

export function JobDetails({ job }: JobDetailsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Job Overview */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">{job.description}</p>
          {/* <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Required Skills:</h4>
                        <div className="flex flex-wrap gap-2">
                            {job.requiredSkills?.map((skill: string) => (
                                <Badge key={skill} variant="secondary" className="bg-blue-100 text-blue-800">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div> */}
        </CardContent>
      </Card>

      {/* Job Info */}
      <Card>
        <CardHeader>
          <CardTitle>Job Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Building className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Department</p>
                <p className="text-sm text-gray-600">{job.department}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-gray-600">{job.location}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Employment Type</p>
                <p className="text-sm text-gray-600 mt-1">
                  {EmploymentTypeBadge({ employmentType: job.employmentType })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Salary Range</p>
                <p className="text-sm text-gray-600">
                  {formatSalary(job.salaryMin, job.salaryMax, job.currency, job.salaryType)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Posted Date</p>
                <p className="text-sm text-gray-600">
                  {new Date(job.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          {/* <div className="border-t pt-4">
                        <h5 className="font-semibold text-gray-900 mb-2">Application Stats</h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Applications</span>
                                <span className="font-medium">5</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">In Screening</span>
                                <span className="font-medium">1</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Average Score</span>
                                <span className="font-medium">87.6%</span>
                            </div>
                        </div>
                    </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
