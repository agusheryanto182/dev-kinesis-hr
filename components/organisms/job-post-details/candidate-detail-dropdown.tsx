'use client';
import {
  CheckCircle,
  XCircle,
  User,
  MapPin,
  GraduationCap,
  Languages,
  Award,
  Linkedin,
  Github,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
// import { ResumeViewer } from '@/components/organisms/job-post-details/resume-viewer';
import { ApplicantResponseDTO } from '@/types/applicant';
import { Screening } from '@/types/job-post';


interface CandidateDetailDropdownProps {
  candidate: ApplicantResponseDTO & {
    screening?: Screening
  };
  onClose: () => void;
}

export function CandidateDetailDropdown({
  candidate,
  onClose,
}: CandidateDetailDropdownProps) {

  const matchingSkills = candidate.screening?.accurateKeywords

  const missingSkills = candidate.screening?.missingKeywords

  // const additionalSkills = candidate.screening?.finalThoughts


  const getMatchPercentage = () => {
    return candidate.screening?.matchPercentage
  };


  return (
    <div
      className="fixed inset-0 bg-zinc-400 bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white py-5 px-2 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">{candidate.fullName}</CardTitle>
                <p className="text-sm text-gray-600">{candidate.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">

              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills Analysis */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Skills Match Analysis</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {getMatchPercentage()}% Match
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Matching Skills */}
                  <div>
                    <h4 className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">
                        Matching Skills ({matchingSkills?.length})
                      </span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {matchingSkills?.map((skill) => (
                        <Badge key={skill} className="bg-green-100 text-green-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  {(missingSkills?.length || 0) > 0 && (
                    <div>
                      <h4 className="flex items-center space-x-2 mb-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-red-800">
                          Missing Skills ({missingSkills?.length})
                        </span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {missingSkills?.map((skill) => (
                          <Badge key={skill} className="bg-red-100 text-red-800">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Skills */}
                  {/* {(additionalSkills?.length || 0) > 0 && (
                    <div>
                      <h4 className="flex items-center space-x-2 mb-2">
                        <Award className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">
                          Additional Skills ({additionalSkills?.length})
                        </span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {additionalSkills?.map((skill) => (
                          <Badge key={skill} className="bg-blue-100 text-blue-800">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )} */}
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>Experience</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(candidate.experience as any[]).map((exp: { company: string, role: string }, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm">{exp.company}</span>
                        <span className="text-sm">{exp.role}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Personal Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Years of Experience</p>
                      <p className="font-medium">{candidate.yearOfExperience} years</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="font-medium">{candidate.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{candidate.email}</p>
                    </div>

                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-600">Location</p>
                    </div>
                    <p className="font-medium">{candidate.location}</p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <GraduationCap className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-600">Education</p>
                    </div>
                    {

                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (candidate.education as any[]).map((ed: { major: string, institution: string }, index) => (
                        <p className="font-medium" key={index}>{ed.major} - {ed.institution}</p>
                      ))
                    }
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Languages className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-600">Languages</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(candidate.languages as string[]).map((lang) => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Salary Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Expected Salary</p>
                    <p className="font-medium text-green-600">
                      {candidate.applications?.[0].expectedSalary}
                    </p>
                  </div>

                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profiles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {
                    candidate.profileLinks.map((profile, index) => (
                      <div key={index}>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <a href={profile} target="_blank" rel="noopener noreferrer" className='text-blue-400 flex space-x-2'>
                            {
                              profile.includes("linkedin") ? (
                                <>
                                  <Linkedin /> <span className='ml-2'>LinkedIn</span>
                                </>
                              ) : profile.includes("github") && (
                                <>
                                  <Github /> <span className='ml-2'>Github</span>
                                </>
                              )
                            }
                          </a>
                        </Button>
                      </div>
                    ))
                  }

                </CardContent>
              </Card>
            </div>
          </div>

          {/* Summary */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Professional Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{candidate.summary == 'null' || candidate.summary == null ? '-' : '-'}</p>
            </CardContent>
          </Card>
        </CardContent>
      </div>
    </div>
  );
}
