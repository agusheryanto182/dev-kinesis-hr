'use client';
import { useState } from 'react';
import {
  MoreHorizontal,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  Star,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
// import { CandidateDetailDropdown } from '@/components/organisms/job-post-details/candidate-detail-dropdown';

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

interface CandidateTableProps {
  candidates: Candidate[];
  jobRequiredSkills: string[];
}

export function CandidateTable({ candidates, jobRequiredSkills }: CandidateTableProps) {
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCandidates(candidates.map((c) => c.id));
    } else {
      setSelectedCandidates([]);
    }
  };

  const handleSelectCandidate = (candidateId: number, checked: boolean) => {
    if (checked) {
      setSelectedCandidates([...selectedCandidates, candidateId]);
    } else {
      setSelectedCandidates(selectedCandidates.filter((id) => id !== candidateId));
    }
  };

  const handleCandidateClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      applied: 'bg-blue-100 text-blue-800',
      screening: 'bg-yellow-100 text-yellow-800',
      review: 'bg-purple-100 text-purple-800',
      offer: 'bg-green-100 text-green-800',
      hired: 'bg-emerald-100 text-emerald-800',
      rejected: 'bg-red-100 text-red-800',
    };

    return (
      <Badge className={`${statusColors[status] || 'bg-gray-100 text-gray-800'} border-0`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getExperienceBadge = (level: string) => {
    const colors = {
      junior: 'bg-gray-100 text-gray-800',
      mid: 'bg-blue-100 text-blue-800',
      senior: 'bg-green-100 text-green-800',
      lead: 'bg-purple-100 text-purple-800',
    };

    return (
      <Badge className={`${colors[level as keyof typeof colors] || colors.mid} border-0`}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </Badge>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getSkillsMatchInfo = (candidate: Candidate) => {
    const matchingSkills = candidate.skills.filter((skill) => jobRequiredSkills.includes(skill));
    const matchPercentage = Math.round((matchingSkills.length / jobRequiredSkills.length) * 100);

    return {
      matching: matchingSkills.length,
      total: jobRequiredSkills.length,
      percentage: matchPercentage,
    };
  };

  const totalPages = Math.ceil(candidates.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentCandidates = candidates.slice(startIndex, endIndex);

  if (candidates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No candidates match your current filters.</p>
        <p className="text-sm text-gray-400 mt-2">Try adjusting your search criteria or filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedCandidates.length === candidates.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Candidate</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Skills Match</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Resume</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCandidates.map((candidate) => {
              const skillsMatch = getSkillsMatchInfo(candidate);

              return (
                <TableRow
                  key={candidate.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleCandidateClick(candidate)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedCandidates.includes(candidate.id)}
                      onCheckedChange={(checked) =>
                        handleSelectCandidate(candidate.id, checked as boolean)
                      }
                    />
                  </TableCell>

                  {/* Candidate Info */}
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">{candidate.fullName}</p>
                      <p className="text-sm text-blue-600">{candidate.email}</p>
                      <p className="text-sm text-gray-500">{candidate.phone}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {candidate.religion}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {candidate.nationality}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>

                  {/* Score */}
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className={`px-2 py-1 rounded-full ${getScoreColor(candidate.score)}`}>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3" />
                          <span className="text-sm font-medium">{candidate.score}%</span>
                        </div>
                      </div>
                    </div>
                    <Progress value={candidate.score} className="w-16 h-1 mt-1" />
                  </TableCell>

                  {/* Skills Match */}
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${skillsMatch.percentage >= 80
                            ? 'bg-green-100 text-green-800'
                            : skillsMatch.percentage >= 60
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {skillsMatch.matching}/{skillsMatch.total} ({skillsMatch.percentage}%)
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {candidate.highlightedSkills.slice(0, 2).map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="text-xs bg-green-100 text-green-800"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{candidate.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Experience */}
                  <TableCell>
                    <div className="space-y-1">
                      {getExperienceBadge(candidate.experienceLevel)}
                      <p className="text-sm text-gray-500">({candidate.yearsOfExperience}y)</p>
                    </div>
                  </TableCell>

                  {/* Location */}
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-gray-700">{candidate.location}</span>
                    </div>
                  </TableCell>

                  {/* Salary */}
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Current:</p>
                      <p className="text-sm font-medium">{formatSalary(candidate.currentSalary)}</p>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <p className="text-sm text-gray-600">Expected:</p>
                      </div>
                      <p className="text-sm font-medium text-green-600">
                        {formatSalary(candidate.expectedSalary)}
                      </p>
                    </div>
                  </TableCell>

                  {/* Resume */}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-blue-600">
                      <Download className="h-3 w-3 mr-1" />
                      {candidate.resume}
                    </Button>
                  </TableCell>

                  {/* Applied Date */}
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(candidate.appliedDate)}
                  </TableCell>

                  {/* Status */}
                  <TableCell>{getStatusBadge(candidate.status)}</TableCell>

                  {/* Actions */}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleCandidateClick(candidate)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Full Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download Resume
                        </DropdownMenuItem>
                        <DropdownMenuItem>Schedule Interview</DropdownMenuItem>
                        <DropdownMenuItem>Move to Screening</DropdownMenuItem>
                        <DropdownMenuItem>Send Assessment</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Reject Candidate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Footer with pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedCandidates.length} of {candidates.length} candidates selected.
            {candidates.length > 0 && (
              <span className="ml-2">
                Average score:{' '}
                {Math.round(candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length)}%
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <span>Rows per page</span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        null
        // <CandidateDetailDropdown
        //   candidate={selectedCandidate as unknown as never}
        //   onClose={() => setSelectedCandidate(null)}
        // />
      )}
    </>
  );
}
