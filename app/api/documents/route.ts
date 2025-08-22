/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import prisma from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadResults: any[] = [];
    const uploadErrors: { fileName: string; error: string }[] = [];

    for (const file of files) {
      if (file && file.name && file.size > 0) {
        try {
          // Convert File to buffer
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const originalFileName = file.name.split('.')[0];
          const fileExtension = file.name.split('.').pop();

          // 2. Parse PDF → Text (only if file is pdf)
          let localTxtPath: string | null = null;
          if (fileExtension?.toLowerCase() === 'pdf') {
            const pdfData = await pdfParse(buffer);
            const extractedText = pdfData.text;

            // Ensure local directory exists
            const localDir = path.join(process.cwd(), 'uploads');
            await fs.mkdir(localDir, { recursive: true });

            // Save text file locally
            localTxtPath = path.join(localDir, `${Date.now()}-${originalFileName}.txt`);
            await fs.writeFile(localTxtPath, extractedText, 'utf8');
          }

          // 1. Upload to Cloudinary
          const result: UploadApiResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  resource_type: 'raw',
                  folder: 'documents/anonymous',
                  public_id: `${Date.now()}-${originalFileName}.${fileExtension}`,
                  use_filename: true,
                  unique_filename: false,
                  format: fileExtension,
                },
                (error, result) => {
                  if (error) reject(error);
                  else if (result) resolve(result);
                  else reject(new Error('Cloudinary upload failed without error object.'));
                },
              )
              .end(buffer);
          });

          

          // 3. Save record in Prisma
          const documentData: any = {
            fileName: file.name,
            filePath: result.secure_url,
            fileSize: result.bytes,
            fileType: result.format || file.type.split('/')[1] || 'pdf',
            localPath: localTxtPath, // new field in Prisma schema
          };

          if (userId) {
            documentData.owner = { connect: { id: userId } };
          }

          const savedDocument = await prisma.document.create({ data: documentData });

          uploadResults.push(savedDocument);
        } catch (uploadError: any) {
          console.error(`Error processing file ${file.name}:`, uploadError);
          const errorMessage = uploadError.message || 'Failed to process file';
          uploadErrors.push({ fileName: file.name, error: errorMessage });
        }
      }
    }

    if (uploadErrors.length > 0 && uploadResults.length === 0) {
      return NextResponse.json({ error: 'All file uploads failed', details: uploadErrors }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: uploadErrors.length > 0 ? 'Some files failed to upload' : 'Files uploaded successfully',
        data: uploadResults,
        errors: uploadErrors.length > 0 ? uploadErrors : undefined,
      },
      { status: uploadErrors.length > 0 ? 207 : 200 },
    );
  } catch (error) {
    console.error('Error in file upload handler:', error);
    return NextResponse.json({ error: 'Failed to process file uploads' }, { status: 500 });
  }
}



export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  // Get difyConversationId from query parameters
  const { searchParams } = new URL(req.url);
  const difyConversationId = searchParams.get('difyConversationId');

  if (!difyConversationId) {
    return NextResponse.json({ error: 'difyConversationId is required' }, { status: 400 });
  }

  try {
    const documents = await prisma.chat.findFirst({
      where: {
        difyConversationId: difyConversationId,
        context: {
          userId: userId,
        },
      },
      select: {
        context: {
          select: {
            documents: {
              select: {
                document: true,
              },
              where: {
                document: {
                  ownerId: userId,
                },
              },
            },
          },
        },
      },
    });

    if (!documents) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    const flattenedDocuments = documents.context.documents.map((doc) => doc.document);

    return NextResponse.json(
      {
        data: flattenedDocuments,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error in file upload handler:', error);
    return NextResponse.json({ error: 'Failed to process file uploads' }, { status: 500 });
  }
}
