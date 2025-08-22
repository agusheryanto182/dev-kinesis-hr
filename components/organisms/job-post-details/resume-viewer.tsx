import { Download, X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

interface ResumeViewerProps {
    candidateName: string;
    resumeFile: string;
    onClose: () => void;
}

export function ResumeViewer({ candidateName, resumeFile, onClose }: ResumeViewerProps) {
    const [zoom, setZoom] = useState(100);
    const [rotation, setRotation] = useState(0);

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 25, 200));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 25, 50));
    };

    const handleRotate = () => {
        setRotation(prev => (prev + 90) % 360);
    };

    const handleDownload = () => {
        // Mock download functionality
        const link = document.createElement('a');
        link.href = '#';
        link.download = resumeFile;
        link.click();
    };

    // Mock resume content - in real app this would be PDF viewer or image
    const mockResumeContent = (
        <div className="bg-white p-8 shadow-lg mx-auto max-w-2xl">
            <div className="space-y-6">
                {/* Header */}
                <div className="text-center border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-900">{candidateName}</h1>
                    <p className="text-gray-600">Senior Golang Developer</p>
                    <p className="text-sm text-gray-500">Email: {candidateName.toLowerCase().replace(' ', '.')}@email.com</p>
                    <p className="text-sm text-gray-500">Phone: +62 812-3456-7890</p>
                </div>

                {/* Professional Summary */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h2>
                    <p className="text-gray-700 text-sm leading-relaxed">
                        Experienced software engineer with 5+ years of expertise in Go/Golang development,
                        microservices architecture, and cloud technologies. Proven track record of building
                        scalable backend systems and leading technical teams in fast-paced environments.
                    </p>
                </div>

                {/* Experience */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Work Experience</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium text-gray-900">Senior Backend Developer</h3>
                            <p className="text-sm text-gray-600">Tech Company Inc. • 2021 - Present</p>
                            <ul className="text-sm text-gray-700 mt-1 space-y-1">
                                <li>• Developed microservices using Go, Docker, and Kubernetes</li>
                                <li>• Implemented gRPC APIs serving 1M+ requests per day</li>
                                <li>• Led migration from monolithic to microservices architecture</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900">Backend Developer</h3>
                            <p className="text-sm text-gray-600">StartupXYZ • 2019 - 2021</p>
                            <ul className="text-sm text-gray-700 mt-1 space-y-1">
                                <li>• Built REST APIs using Go and PostgreSQL</li>
                                <li>• Implemented caching solutions with Redis</li>
                                <li>• Optimized database queries resulting in 40% performance improvement</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Technical Skills</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <h4 className="font-medium text-gray-900">Programming Languages</h4>
                            <p className="text-gray-700">Go, Python, JavaScript, SQL</p>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">Technologies</h4>
                            <p className="text-gray-700">Docker, Kubernetes, AWS, Redis</p>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">Databases</h4>
                            <p className="text-gray-700">PostgreSQL, MongoDB, Redis</p>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">Tools</h4>
                            <p className="text-gray-700">Git, Jenkins, Prometheus, Grafana</p>
                        </div>
                    </div>
                </div>

                {/* Education */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Education</h2>
                    <div>
                        <h3 className="font-medium text-gray-900">Bachelor of Computer Science</h3>
                        <p className="text-sm text-gray-600">University of Indonesia • 2015 - 2019</p>
                    </div>
                </div>

                {/* Certifications */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Certifications</h2>
                    <ul className="text-sm text-gray-700 space-y-1">
                        <li>• AWS Solutions Architect Associate (2022)</li>
                        <li>• Kubernetes Administrator (CKA) (2021)</li>
                        <li>• Docker Certified Associate (2020)</li>
                    </ul>
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                    <CardTitle>Resume: {candidateName}</CardTitle>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={handleZoomOut}>
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-gray-600 min-w-[60px] text-center">{zoom}%</span>
                        <Button variant="outline" size="sm" onClick={handleZoomIn}>
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleRotate}>
                            <RotateCw className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDownload}>
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <p className="text-sm text-gray-600">File: {resumeFile}</p>
            </CardHeader>

            {/* Content */}
            <CardContent className="flex-1 p-6 bg-gray-100 overflow-auto">
                <div className="flex justify-center">
                    <div
                        style={{
                            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                            transformOrigin: 'center center',
                            transition: 'transform 0.2s ease-in-out'
                        }}
                    >
                        {mockResumeContent}
                    </div>
                </div>
            </CardContent>

            {/* Footer */}
            <div className="border-t p-4 bg-gray-50">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Use zoom controls to adjust view • Click rotate to change orientation</span>
                    <Button onClick={handleDownload} size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                    </Button>
                </div>
            </div>
        </div>
    );
}