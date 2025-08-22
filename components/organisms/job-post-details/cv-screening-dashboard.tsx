/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { Search, ChevronDown, Filter, Info, MapPin, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CandidateTable } from '@/components/organisms/job-post-details/candidate-detail';
import { Badge } from '@/components/ui/badge';
import { AdvancedFilters } from '@/components/organisms/job-post-details/advanced-filters';
import { JobDetails } from '@/components/organisms/job-post-details/job-details';

const jobPost = {
    title: "Senior Golang Developer",
    department: "Engineering",
    location: "Jakarta, Indonesia",
    type: "Full-time",
    salary: "15-25 juta IDR",
    postedDate: "2024-01-10",
    description: "We are looking for an experienced Golang developer to join our backend team. You will be responsible for building scalable microservices and APIs.",
    requirements: [
        "3+ years of experience with Go/Golang",
        "Experience with microservices architecture",
        "Knowledge of Docker and Kubernetes",
        "Experience with PostgreSQL or similar databases",
        "Familiarity with gRPC and REST APIs",
        "Understanding of distributed systems",
        "Experience with cloud platforms (AWS, GCP, or Azure)"
    ],
    niceToHave: [
        "Experience with Redis",
        "Knowledge of message queues (RabbitMQ, Kafka)",
        "Experience with monitoring tools (Prometheus, Grafana)",
        "Contribution to open source projects"
    ],
    requiredSkills: ["golang", "microservices", "docker", "kubernetes", "postgresql", "grpc", "rest-api"]
};

const mockCandidates = [
    {
        id: 1,
        fullName: "Ahmad Rizki Pratama",
        email: "ahmad.rizki@email.com",
        phone: "+62 812-3456-7890",
        resume: "ahmad_rizki_resume.pdf",
        appliedDate: "2024-01-15",
        status: "applied",
        score: 85,
        experienceLevel: "senior",
        location: "Jakarta, Indonesia",
        skills: ["golang", "microservices", "docker", "postgresql", "redis", "aws"],
        highlightedSkills: ["golang", "microservices", "docker"],
        yearsOfExperience: 5,
        currentSalary: 18000000,
        expectedSalary: 22000000,
        summary: "Senior backend developer with 5 years of Go experience, specializing in microservices architecture.",
        education: "S1 Teknik Informatika - Universitas Indonesia",
        religion: "Islam",
        nationality: "Indonesia",
        languages: ["Indonesian", "English"],
        certifications: ["AWS Solutions Architect", "Kubernetes Administrator"],
        githubProfile: "https://github.com/ahmadrizki",
        linkedinProfile: "https://linkedin.com/in/ahmadrizki"
    },
    {
        id: 2,
        fullName: "Sarah Christina Wilson",
        email: "sarah.wilson@email.com",
        phone: "+1 (555) 234-5678",
        resume: "sarah_wilson_cv.pdf",
        appliedDate: "2024-01-14",
        status: "screening",
        score: 92,
        experienceLevel: "senior",
        location: "Jakarta, Indonesia",
        skills: ["golang", "microservices", "kubernetes", "postgresql", "grpc", "prometheus", "kafka"],
        highlightedSkills: ["golang", "kubernetes", "grpc"],
        yearsOfExperience: 6,
        currentSalary: 20000000,
        expectedSalary: 25000000,
        summary: "Expert Go developer with extensive experience in distributed systems and cloud infrastructure.",
        education: "MS Computer Science - Stanford University",
        religion: "Christian",
        nationality: "USA",
        languages: ["English", "Indonesian", "Mandarin"],
        certifications: ["Google Cloud Professional", "Docker Certified Associate"],
        githubProfile: "https://github.com/sarahwilson",
        linkedinProfile: "https://linkedin.com/in/sarahwilson"
    },
    {
        id: 3,
        fullName: "Michael Chen Wei Ming",
        email: "m.chen@email.com",
        phone: "+62 813-4567-8901",
        resume: "michael_chen_resume.pdf",
        appliedDate: "2024-01-13",
        status: "review",
        score: 78,
        experienceLevel: "mid",
        location: "Bandung, Indonesia",
        skills: ["golang", "docker", "postgresql", "rest-api", "mongodb"],
        highlightedSkills: ["golang", "docker"],
        yearsOfExperience: 3,
        currentSalary: 15000000,
        expectedSalary: 18000000,
        summary: "Mid-level developer with solid Go foundation and growing expertise in containerization.",
        education: "S1 Sistem Informasi - Institut Teknologi Bandung",
        religion: "Buddhism",
        nationality: "Indonesia",
        languages: ["Indonesian", "English", "Mandarin"],
        certifications: ["Docker Fundamentals", "PostgreSQL Developer"],
        githubProfile: "https://github.com/michaelchen",
        linkedinProfile: "https://linkedin.com/in/michaelchen"
    },
    {
        id: 4,
        fullName: "Siti Fatimah Zahra",
        email: "siti.fatimah@email.com",
        phone: "+62 814-5678-9012",
        resume: "siti_fatimah_cv.pdf",
        appliedDate: "2024-01-12",
        status: "offer",
        score: 95,
        experienceLevel: "senior",
        location: "Surabaya, Indonesia",
        skills: ["golang", "microservices", "kubernetes", "docker", "postgresql", "grpc", "aws", "terraform"],
        highlightedSkills: ["golang", "microservices", "kubernetes"],
        yearsOfExperience: 7,
        currentSalary: 22000000,
        expectedSalary: 28000000,
        summary: "Senior engineer with deep expertise in Go, cloud-native technologies, and infrastructure as code.",
        education: "S1 Teknik Informatika - Universitas Airlangga",
        religion: "Islam",
        nationality: "Indonesia",
        languages: ["Indonesian", "English", "Arabic"],
        certifications: ["AWS DevOps Professional", "Terraform Associate", "Kubernetes Security"],
        githubProfile: "https://github.com/sitifatimah",
        linkedinProfile: "https://linkedin.com/in/sitifatimah"
    },
    {
        id: 5,
        fullName: "David Kumar Singh",
        email: "david.kumar@email.com",
        phone: "+62 815-6789-0123",
        resume: "david_kumar_resume.pdf",
        appliedDate: "2024-01-11",
        status: "hired",
        score: 88,
        experienceLevel: "senior",
        location: "Jakarta, Indonesia",
        skills: ["golang", "microservices", "docker", "kubernetes", "postgresql", "redis", "rabbitmq"],
        highlightedSkills: ["golang", "microservices"],
        yearsOfExperience: 4,
        currentSalary: 19000000,
        expectedSalary: 23000000,
        summary: "Experienced Go developer with strong background in message queues and caching systems.",
        education: "BE Computer Engineering - Delhi University",
        religion: "Hindu",
        nationality: "India",
        languages: ["English", "Indonesian", "Hindi", "Tamil"],
        certifications: ["Redis Certified Developer", "RabbitMQ Professional"],
        githubProfile: "https://github.com/davidkumar",
        linkedinProfile: "https://linkedin.com/in/davidkumar"
    }
];

export function CvScreeningDashboard() {
    const [activeTab, setActiveTab] = useState('applied');
    const [searchTerm, setSearchTerm] = useState('');
    const [showJobDetails, setShowJobDetails] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        experienceLevel: '',
        minScore: 0,
        maxScore: 100,
        location: '',
        skills: [] as string[],
        minExperience: 0,
        maxSalary: 0,
        customFilters: {} as Record<string, string>
    });

    const getCandidatesByStatus = (status: string) => {
        if (status === 'applied') return mockCandidates.filter(c => c.status === 'applied');
        if (status === 'screening') return mockCandidates.filter(c => c.status === 'screening');
        if (status === 'review') return mockCandidates.filter(c => c.status === 'review');
        if (status === 'offer') return mockCandidates.filter(c => c.status === 'offer');
        if (status === 'hired') return mockCandidates.filter(c => c.status === 'hired');
        if (status === 'rejected') return mockCandidates.filter(c => c.status === 'rejected');
        return mockCandidates;
    };

    const getStatusCount = (status: string) => {
        return getCandidatesByStatus(status).length;
    };

    const applyFilters = (candidates: any[]) => {
        return candidates.filter(candidate => {
            // Basic search
            const matchesSearch = candidate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                candidate.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                candidate.skills.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()));

            // Experience level filter - check for empty string or 'all' value
            const matchesExperienceLevel = !filters.experienceLevel ||
                filters.experienceLevel === 'all' ||
                candidate.experienceLevel === filters.experienceLevel;

            // Score filter
            const matchesScore = candidate.score >= filters.minScore && candidate.score <= filters.maxScore;

            // Location filter
            const matchesLocation = !filters.location || candidate.location.toLowerCase().includes(filters.location.toLowerCase());

            // Skills filter
            const matchesSkills = filters.skills.length === 0 ||
                filters.skills.every(skill => candidate.skills.includes(skill));

            // Experience years filter
            const matchesExperience = candidate.yearsOfExperience >= filters.minExperience;

            // Salary filter
            const matchesSalary = !filters.maxSalary || candidate.expectedSalary <= filters.maxSalary;

            // Custom filters
            const matchesCustomFilters = Object.entries(filters.customFilters).every(([key, value]) => {
                if (!value) return true;
                const candidateValue = candidate[key as keyof typeof candidate];
                if (typeof candidateValue === 'string') {
                    return candidateValue.toLowerCase().includes(value.toLowerCase());
                }
                if (Array.isArray(candidateValue)) {
                    return candidateValue.some(item =>
                        typeof item === 'string' && item.toLowerCase().includes(value.toLowerCase())
                    );
                }
                return String(candidateValue).toLowerCase().includes(value.toLowerCase());
            });

            return matchesSearch && matchesExperienceLevel && matchesScore &&
                matchesLocation && matchesSkills && matchesExperience &&
                matchesSalary && matchesCustomFilters;
        });
    };

    const filteredCandidates = applyFilters(getCandidatesByStatus(activeTab));

    // Helper function to check if filters are active
    const hasActiveFilters = () => {
        return filters.experienceLevel && filters.experienceLevel !== 'all' ||
            filters.skills.length > 0 ||
            filters.location ||
            filters.minScore > 0 ||
            Object.keys(filters.customFilters).some(key => filters.customFilters[key]);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white border-b px-6 py-4">
                    {/* Breadcrumb */}
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>Hiring</span>
                            <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                            <span>{jobPost.title}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowJobDetails(!showJobDetails)}
                                className="flex items-center space-x-2"
                            >
                                <Info className="h-4 w-4" />
                                <span>Job Details</span>
                            </Button>
                        </div>
                    </div>

                    {/* Job Summary */}
                    <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{jobPost.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Posted {new Date(jobPost.postedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{jobPost.salary}</span>
                        </div>
                    </div>
                </header>

                {/* Job Details Panel */}
                {showJobDetails && (
                    <div className="border-b bg-blue-50 p-6">
                        <JobDetails job={jobPost} />
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 p-6">
                    <div className="bg-white rounded-lg shadow-sm">
                        {/* Tabs */}
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <div className="border-b px-6 pt-6">
                                <TabsList className="h-auto p-0 bg-transparent">
                                    <TabsTrigger
                                        value="applied"
                                        className="px-4 py-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                                    >
                                        Applied
                                        {getStatusCount('applied') > 0 && (
                                            <Badge variant="secondary" className="ml-2">
                                                {getStatusCount('applied')}
                                            </Badge>
                                        )}
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="screening"
                                        className="px-4 py-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                                    >
                                        At Screening
                                        {getStatusCount('screening') > 0 && (
                                            <Badge variant="secondary" className="ml-2">
                                                {getStatusCount('screening')}
                                            </Badge>
                                        )}
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="review"
                                        className="px-4 py-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                                    >
                                        Review
                                        {getStatusCount('review') > 0 && (
                                            <Badge variant="secondary" className="ml-2">
                                                {getStatusCount('review')}
                                            </Badge>
                                        )}
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="offer"
                                        className="px-4 py-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                                    >
                                        Offer
                                        {getStatusCount('offer') > 0 && (
                                            <Badge variant="secondary" className="ml-2">
                                                {getStatusCount('offer')}
                                            </Badge>
                                        )}
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="hired"
                                        className="px-4 py-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                                    >
                                        Hired
                                        {getStatusCount('hired') > 0 && (
                                            <Badge variant="secondary" className="ml-2">
                                                {getStatusCount('hired')}
                                            </Badge>
                                        )}
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="rejected"
                                        className="px-4 py-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                                    >
                                        Rejected
                                        {getStatusCount('rejected') > 0 && (
                                            <Badge variant="secondary" className="ml-2">
                                                {getStatusCount('rejected')}
                                            </Badge>
                                        )}
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            {/* Search and Actions */}
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                placeholder="Search by name, skills, experience..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 w-80"
                                            />
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowFilters(!showFilters)}
                                            className="flex items-center space-x-2"
                                        >
                                            <Filter className="h-4 w-4" />
                                            <span>Advanced Filters</span>
                                        </Button>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="outline" size="sm">
                                            Export Data
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            Bulk Actions
                                        </Button>
                                    </div>
                                </div>

                                {/* Advanced Filters */}
                                {showFilters && (
                                    <AdvancedFilters
                                        filters={filters}
                                        onFiltersChange={setFilters}
                                        jobRequiredSkills={jobPost.requiredSkills}
                                    />
                                )}

                                {/* Active Filters Summary */}
                                {hasActiveFilters() && (
                                    <div className="mt-4 flex items-center space-x-2 text-sm">
                                        <span className="text-gray-600">Active filters:</span>
                                        {filters.experienceLevel && filters.experienceLevel !== 'all' && (
                                            <Badge variant="outline">Level: {filters.experienceLevel}</Badge>
                                        )}
                                        {filters.skills.map(skill => (
                                            <Badge key={skill} variant="outline">Skill: {skill}</Badge>
                                        ))}
                                        {filters.location && (
                                            <Badge variant="outline">Location: {filters.location}</Badge>
                                        )}
                                        {filters.minScore > 0 && (
                                            <Badge variant="outline">Min Score: {filters.minScore}%</Badge>
                                        )}
                                        {Object.entries(filters.customFilters).map(([key, value]) =>
                                            value && (
                                                <Badge key={key} variant="outline">{key}: {value}</Badge>
                                            )
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setFilters({
                                                experienceLevel: '',
                                                minScore: 0,
                                                maxScore: 100,
                                                location: '',
                                                skills: [],
                                                minExperience: 0,
                                                maxSalary: 0,
                                                customFilters: {}
                                            })}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            Clear all
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Table Content */}
                            <div className="p-6">
                                <TabsContent value={activeTab} className="mt-0">
                                    <CandidateTable
                                        candidates={filteredCandidates}
                                        jobRequiredSkills={jobPost.requiredSkills}
                                    />
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}