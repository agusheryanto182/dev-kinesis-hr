import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { geminiAI } from '@/lib/gemini';
import { Type } from '@google/genai';
import fs from 'fs/promises';

const genPrompt = (jobDesc: string, cvText: string, customRequirement: object) => `
You are an ATS evaluator.
Your task is to analyze the given resume against the provided job description.
Rules:
1. Always use the exact job description and resume provided below.
2. If the job description and resume are the same as previously provided, return the same analysis and match percentage.
3. If either the job description or resume has changed (even slightly), re-run the evaluation and update results.
4. Perform strict ATS-style analysis:
- Infer implied skills from experiences. Example: "Built an ecommerce website and integrated APIs" → implies REST API.
- Distinguish core skills vs tools. Tools like GitHub, Jira, Trello must not be counted as missing skills.
- Focus only on hard skills and soft skills relevant to the job description.
- Calculate the match percentage based only on required and nice-to-have skills.
- Clearly separate missing skills and matching skills.
- Recommendations must be actionable and natural additions to the resume.

Job Description:
${jobDesc}

Resume:
${cvText}

Additional Custom Requirements (from recruiter):
${JSON.stringify(customRequirement, null, 2)}
`;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { application_id, custom_requirement } = body;

    // ambil job desc dari prisma
    const jobPost = await prisma.jobPost.findUnique({
      where: { id: parseInt(id) },
      select: { description: true },
    });

    if (!jobPost) {
      return NextResponse.json({ error: 'Job post not found' }, { status: 404 });
    }

    // ambil CV text dari prisma
    const application = await prisma.application.findUnique({
      where: { id: application_id },
      include: {
        documents: {
          include: {
            document: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (application.documents.length > 0) {
      if (application.documents[0].document.localPath) {
        const localPath = application.documents[0].document.localPath;
        if (!localPath) {
          return NextResponse.json({
            success: true,
            data: null,
          });
        }
        const cvText = await fs.readFile(localPath, 'utf-8');

        const prompt = genPrompt(jobPost.description, cvText, custom_requirement);

        const result = await geminiAI.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            temperature: 0,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                matchPercentage: {
                  type: Type.NUMBER,
                },
                missingKeywords: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.STRING,
                  },
                },
                accurateKeywords: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.STRING,
                  },
                },
                finalThoughts: {
                  type: Type.STRING,
                },
                recommendations: {
                  type: Type.STRING,
                },
              },
            },
          },
        });

        if (result.text) {
          const responseJson = JSON.parse(result.text);

          return NextResponse.json({
            success: true,
            data: responseJson,
          });
        }
        return NextResponse.json({
          success: true,
          data: null,
        });
      }
      return NextResponse.json({
        success: true,
        data: null,
      });
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } catch (error) {
    console.error('Error in /api/job-posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
