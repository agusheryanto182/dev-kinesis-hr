import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CreateApplicationRequestDTO } from '@/types/application';
import { Type } from '@google/genai';
import { geminiAI } from '@/lib/gemini';
import fs from "fs/promises"

export async function GET() {
  const applications = await prisma.application.findMany({
    include: {
      applicant: true,
    },
  });
  return NextResponse.json(applications);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = CreateApplicationRequestDTO.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Validation error", errors: validation.error.errors },
        { status: 400 }
      );
    }

    const {
      fullName,
      email,
      phone,
      jobPostId,
      expectedSalary,
      notes,
      documentIds,
    } = validation.data;

    const result = await prisma.$transaction(
      async (tx) => {
        // --- Parse CV & Update applicant ---
        const document = await tx.document.findFirstOrThrow({
          where: { id: documentIds[0] },
        });

        if (document.localPath) {
          const cvText = await fs.readFile(document.localPath, "utf-8");

          const extractPrompt = (cvText: string) => `
              You are a resume parser.
              Extract the following structured data from the resume text. 
              If data is not available, return null or an empty array.

              Resume:
              ${cvText}
            `;

          const response = await geminiAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: extractPrompt(cvText),
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  location: { type: Type.STRING },
                  languages: { type: Type.ARRAY, items: { type: Type.STRING } },
                  summary: { type: Type.STRING },
                  educations: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        major: { type: Type.STRING },
                        degree: { type: Type.STRING },
                        institution: { type: Type.STRING },
                      },
                    },
                  },
                  experiences: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        role: { type: Type.STRING },
                        company: { type: Type.STRING },
                        duration: { type: Type.STRING },
                        responsibilities: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                        },
                      },
                    },
                  },
                  yearOfExperience: { type: Type.NUMBER },
                  profileLinks: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
              },
            },
          });


          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let parsedData: any = {};
          try {
            if (response.text) {
              parsedData = JSON.parse(response.text);
            }
          } catch (err) {
            console.error("Failed to parse AI response:", err);
          }


          // Check applicant
          let applicant = await tx.applicant.findUnique({ where: { email } });
          if (!applicant) {
            applicant = await tx.applicant.create({
              data: {
                fullName,
                email,
                phone,
                experience: parsedData.experiences,
                location: parsedData.location,
                languages: parsedData.languages,
                summary: parsedData.summary,
                education: parsedData.educations,
                yearOfExperience: parsedData.yearOfExperience,
                profileLinks: parsedData.profileLinks,
              },
            });
          }

          // Prevent duplicate application
          const existingApplication = await tx.application.findFirst({
            where: { applicantId: applicant.id, jobPostId },
          });
          if (existingApplication) {
            throw new Error("You have already applied for this job");
          }

          // Create application
          const application = await tx.application.create({
            data: { jobPostId, applicantId: applicant.id, expectedSalary, notes },
          });

          // Link documents
          if (documentIds?.length) {
            await tx.applicationDocument.createMany({
              data: documentIds.map((documentId) => ({
                applicationId: application.id,
                documentId,
              })),
            });
          }

          // Fetch complete application
          const completeApplication = await tx.application.findUnique({
            where: { id: application.id },
            include: {
              applicant: true,
              documents: { include: { document: true } },
            },
          });

          if (!completeApplication) {
            throw new Error("Failed to create application");
          }

          return completeApplication;
        }

      },
      {
        timeout: 30000,
        maxWait: 35000,
        isolationLevel: "Serializable",
      }
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/applications:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Error creating application",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status:
          error instanceof Error &&
            error.message === "You have already applied for this job"
            ? 409
            : 500,
      }
    );
  }
}