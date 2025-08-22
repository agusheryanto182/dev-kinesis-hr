'use client';
import { CheckCircle, XCircle, Eye, Download, User, MapPin, GraduationCap, Languages, Award, Github, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ResumeViewer } from '@/components/organisms/job-post-details/resume-viewer';
import { useState } from 'react';

interface Candidate {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    resume: string;
    appliedDate: string;
    status: string;
    score: number;
    experienceLevel: string;
    location: string;
    skills: string[];
    highlightedSkills: string[];
    yearsOfExperience: number;
    currentSalary: number;
    expectedSalary: number;
    summary: string;
    education: string;
    religion: string;
    nationality: string;
    languages: string[];
    certifications: string[];
    githubProfile: string;
    linkedinProfile: string;
}

interface CandidateDetailDropdownProps {
    candidate: Candidate;
    jobRequiredSkills: string[];
    onClose: () => void;
}

export function CandidateDetailDropdown({ candidate, jobRequiredSkills, onClose }: CandidateDetailDropdownProps) {
    const [showResume, setShowResume] = useState(false);

    const matchingSkills = candidate.skills.filter(skill =>
        jobRequiredSkills.includes(skill)
    );

    const missingSkills = jobRequiredSkills.filter(skill =>
        !candidate.skills.includes(skill)
    );

    const additionalSkills = candidate.skills.filter(skill =>
        !jobRequiredSkills.includes(skill)
    );

    const formatSalary = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getMatchPercentage = () => {
        return Math.round((matchingSkills.length / jobRequiredSkills.length) * 100);
    };

    if (showResume) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
                    <ResumeViewer
                        candidateName={candidate.fullName}
                        resumeFile={candidate.resume}
                        onClose={() => setShowResume(false)}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
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
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowResume(true)}
                                className="flex items-center space-x-2"
                            >
                                <Eye className="h-4 w-4" />
                                <span>View Resume</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center space-x-2"
                            >
                                <Download className="h-4 w-4" />
                                <span>Download CV</span>
                            </Button>
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
                                            <span className="font-medium text-green-800">Matching Skills ({matchingSkills.length})</span>
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {matchingSkills.map((skill) => (
                                                <Badge key={skill} className="bg-green-100 text-green-800">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Missing Skills */}
                                    {missingSkills.length > 0 && (
                                        <div>
                                            <h4 className="flex items-center space-x-2 mb-2">
                                                <XCircle className="h-4 w-4 text-red-600" />
                                                <span className="font-medium text-red-800">Missing Skills ({missingSkills.length})</span>
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {missingSkills.map((skill) => (
                                                    <Badge key={skill} className="bg-red-100 text-red-800">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Additional Skills */}
                                    {additionalSkills.length > 0 && (
                                        <div>
                                            <h4 className="flex items-center space-x-2 mb-2">
                                                <Award className="h-4 w-4 text-blue-600" />
                                                <span className="font-medium text-blue-800">Additional Skills ({additionalSkills.length})</span>
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {additionalSkills.map((skill) => (
                                                    <Badge key={skill} className="bg-blue-100 text-blue-800">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Certifications */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Award className="h-5 w-5" />
                                        <span>Certifications</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {candidate.certifications.map((cert, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                                                <span className="text-sm">{cert}</span>
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
                                            <p className="text-sm text-gray-600">Experience Level</p>
                                            <p className="font-medium capitalize">{candidate.experienceLevel}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Years of Experience</p>
                                            <p className="font-medium">{candidate.yearsOfExperience} years</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Religion</p>
                                            <p className="font-medium">{candidate.religion}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Nationality</p>
                                            <p className="font-medium">{candidate.nationality}</p>
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
                                        <p className="font-medium">{candidate.education}</p>
                                    </div>

                                    <div>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Languages className="h-4 w-4 text-gray-400" />
                                            <p className="text-sm text-gray-600">Languages</p>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {candidate.languages.map((lang) => (
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
                                        <p className="text-sm text-gray-600">Current Salary</p>
                                        <p className="font-medium">{formatSalary(candidate.currentSalary)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Expected Salary</p>
                                        <p className="font-medium text-green-600">{formatSalary(candidate.expectedSalary)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Salary Increase</p>
                                        <p className="font-medium">
                                            {formatSalary(candidate.expectedSalary - candidate.currentSalary)}
                                            <span className="text-sm text-gray-500 ml-1">
                                                ({Math.round(((candidate.expectedSalary - candidate.currentSalary) / candidate.currentSalary) * 100)}%)
                                            </span>
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Profiles</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        <Github className="h-4 w-4 mr-2" />
                                        GitHub Profile
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        <Linkedin className="h-4 w-4 mr-2" />
                                        LinkedIn Profile
                                    </Button>
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
                            <p className="text-gray-700 leading-relaxed">{candidate.summary}</p>
                        </CardContent>
                    </Card>
                </CardContent>
            </div>
        </div>
    );
}