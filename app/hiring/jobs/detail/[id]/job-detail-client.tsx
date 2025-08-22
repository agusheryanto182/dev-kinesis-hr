'use client';

import * as React from 'react';
import { AppSidebar } from '@/components/organisms/app-sidebar';
import { CandidatesTable } from '@/components/organisms/candidates-table';
import { SiteHeader } from '@/components/organisms/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIAssistantSidebar } from '@/components/organisms/ai-assistant-sidebar';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { JobDetailModal } from './job-detail-modal';
import { JobPostResponseDTO } from '@/types/job-post';
import { Stage } from '@/constants/enums/stage';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIAssistant } from '@/hooks/use-ai-assistant/use-ai-assistant';
import { Calendar, ChevronDown, Info, MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AdvancedFilters } from '@/components/organisms/job-post-details/advanced-filters';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { handleMutation as handleHiringMutation } from '@/utils/mutation/mutation';
import { JobDetails } from '@/components/organisms/job-post-details/job-details';
import { formatSalary } from '@/utils/format-salary/format-salary';

interface JobDetailClientProps {
  initialData: JobPostResponseDTO;
}

export function JobDetailClient({ initialData }: JobDetailClientProps) {
  const params = useParams();
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  const [jobPostsData, setJobPostsData] = React.useState(initialData);
  const [isTableLoading, setIsTableLoading] = React.useState(false);
  const { isMinimized: isAIAssistantMinimized } = useAIAssistant();
  const [activeTab, setActiveTab] = React.useState('applied');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showJobDetails, setShowJobDetails] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const [filters, setFilters] = React.useState({
    experienceLevel: '',
    minScore: 0,
    maxScore: 100,
    location: '',
    skills: [] as string[],
    minExperience: 0,
    maxSalary: 0,
    customFilters: {} as Record<string, string>
  });

  // Helper function to check if filters are active
  const hasActiveFilters = () => {
    return filters.experienceLevel && filters.experienceLevel !== 'all' ||
      filters.skills.length > 0 ||
      filters.location ||
      filters.minScore > 0 ||
      Object.keys(filters.customFilters).some(key => filters.customFilters[key]);
  };

  React.useEffect(() => {
    setJobPostsData(initialData);
  }, [initialData]);

  console.log('jobPostsData', jobPostsData);

  const transformJobPostToCandidates = (jobPost: JobPostResponseDTO, filter?: Stage) => {
    return (
      jobPost?.applications
        ?.filter((application) => application.currentStage === filter)
        .map((application) => ({
          ...application,
          ...application.applicant,
          appliedAt: application.appliedAt,
          phone: application.applicant.phone || null,
          stage: application.currentStage,
        })) || []
    );
  };

  const handleMutation = async (action: string) => {
    try {
      setIsTableLoading(true);
      const result = await handleHiringMutation(action, `/hiring/jobs/detail/${params.id}`);
      if (!result.success) {
        console.error(`Failed to handle ${action}`);
      }
    } finally {
      setIsTableLoading(false);
    }
  };

  return (
    <>
      <div className="relative m-0 p-0">
        <SidebarProvider
          style={
            {
              '--sidebar-width': 'calc(var(--spacing) * 72)',
              '--header-height': 'calc(var(--spacing) * 12)',
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset className="md:peer-data-[variant=inset]:m-0">
            <SiteHeader />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div
                  className={cn(
                    'flex flex-col gap-4 py-4 md:gap-6 md:py-6',
                    !isAIAssistantMinimized && 'mr-96',
                  )}
                >
                  <div className="px-4 lg:px-6">
                    {/* Header */}
                    <header>
                      {/* Breadcrumb */}
                      <div className=" flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>Hiring</span>
                          <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                          <span>{jobPostsData.title}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowJobDetails(!showJobDetails)}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <Info className="h-4 w-4" />
                            <span>Job Details</span>
                          </Button>
                        </div>
                      </div>

                      {/* Job Summary */}
                      <div className="my-4 flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{jobPostsData.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Posted {new Date(jobPostsData.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>{formatSalary(jobPostsData.salaryMin?.toString(), jobPostsData.salaryMax?.toString(), jobPostsData.currency, jobPostsData.salaryType)}</span>
                        </div>
                      </div>
                    </header>

                    {/* Job Details Panel */}
                    {showJobDetails && (
                      <div className="pb-6">
                        <JobDetails job={jobPostsData} />
                      </div>
                    )}

                    <div className="block md:hidden mb-4">
                      <Select value={activeTab} onValueChange={setActiveTab}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="ai-screening">AI Screening</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="offer">Offer</SelectItem>
                          <SelectItem value="hired">Hired</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="block md:hidden relative mt-6">
                      {activeTab === 'applied' ? (
                        <CandidatesTable
                          data={transformJobPostToCandidates(jobPostsData!, Stage.APPLIED)}
                          onDelete={() => handleMutation('candidate deletion')}
                          isLoading={isTableLoading}
                        />
                      ) : activeTab === 'ai-screening' ? (
                        <CandidatesTable
                          data={transformJobPostToCandidates(jobPostsData!, Stage.AI_SCREENING)}
                          onDelete={() => handleMutation('candidate deletion')}
                          isLoading={isTableLoading}
                        />
                      ) : activeTab === 'review' ? (
                        <CandidatesTable
                          data={transformJobPostToCandidates(jobPostsData!, Stage.REVIEW)}
                          onDelete={() => handleMutation('candidate deletion')}
                          isLoading={isTableLoading}
                        />
                      ) : activeTab === 'offer' ? (
                        <CandidatesTable
                          data={transformJobPostToCandidates(jobPostsData!, Stage.OFFER)}
                          onDelete={() => handleMutation('candidate deletion')}
                          isLoading={isTableLoading}
                        />
                      ) : activeTab === 'hired' ? (
                        <CandidatesTable
                          data={transformJobPostToCandidates(jobPostsData!, Stage.HIRED)}
                          onDelete={() => handleMutation('candidate deletion')}
                          isLoading={isTableLoading}
                        />
                      ) : activeTab === 'rejected' ? (
                        <CandidatesTable
                          data={transformJobPostToCandidates(jobPostsData!, Stage.REJECTED)}
                          onDelete={() => handleMutation('candidate deletion')}
                          isLoading={isTableLoading}
                        />
                      ) : null}
                    </div>
                    <div className="hidden md:block">
                      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-6">
                          <TabsTrigger
                            value="applied"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            Applied
                          </TabsTrigger>
                          <TabsTrigger
                            value="ai-screening"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            AI Screening
                          </TabsTrigger>
                          <TabsTrigger
                            value="review"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            Review
                          </TabsTrigger>
                          <TabsTrigger
                            value="offer"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            Offer
                          </TabsTrigger>
                          <TabsTrigger
                            value="hired"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            Hired
                          </TabsTrigger>
                          <TabsTrigger
                            value="rejected"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            Rejected
                          </TabsTrigger>
                        </TabsList>

                        {/* Search and Actions */}
                        <div className="pt-4">
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
                                <span>Custom Requirements</span>
                              </Button>
                            </div>
                          </div>

                          {/* Advanced Filters */}
                          {showFilters && (
                            <AdvancedFilters
                              filters={filters}
                              onFiltersChange={setFilters}
                              jobRequiredSkills={[]}
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

                        <div className="relative">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={activeTab}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                              <TabsContent value="applied">
                                <CandidatesTable
                                  data={transformJobPostToCandidates(jobPostsData!, Stage.APPLIED)}
                                  onDelete={() => handleMutation('candidate deletion')}
                                  isLoading={isTableLoading}
                                />
                              </TabsContent>
                              <TabsContent value="ai-screening">
                                <CandidatesTable
                                  data={transformJobPostToCandidates(
                                    jobPostsData!,
                                    Stage.AI_SCREENING,
                                  )}
                                  onDelete={() => handleMutation('candidate deletion')}
                                  isLoading={isTableLoading}
                                />
                              </TabsContent>
                              <TabsContent value="review">
                                <CandidatesTable
                                  data={transformJobPostToCandidates(jobPostsData!, Stage.REVIEW)}
                                  onDelete={() => handleMutation('candidate deletion')}
                                  isLoading={isTableLoading}
                                />
                              </TabsContent>
                              <TabsContent value="offer">
                                <CandidatesTable
                                  data={transformJobPostToCandidates(jobPostsData!, Stage.OFFER)}
                                  onDelete={() => handleMutation('candidate deletion')}
                                  isLoading={isTableLoading}
                                />
                              </TabsContent>
                              <TabsContent value="hired">
                                <CandidatesTable
                                  data={transformJobPostToCandidates(jobPostsData!, Stage.HIRED)}
                                  onDelete={() => handleMutation('candidate deletion')}
                                  isLoading={isTableLoading}
                                />
                              </TabsContent>
                              <TabsContent value="rejected">
                                <CandidatesTable
                                  data={transformJobPostToCandidates(jobPostsData!, Stage.REJECTED)}
                                  onDelete={() => handleMutation('candidate deletion')}
                                  isLoading={isTableLoading}
                                />
                              </TabsContent>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </Tabs>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>

      <AIAssistantSidebar />

      {jobPostsData && (
        <JobDetailModal
          jobPost={jobPostsData}
          isOpen={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
        />
      )}
    </>
  );
}
