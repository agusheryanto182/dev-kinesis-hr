/* eslint-disable @typescript-eslint/no-explicit-any */

export class ScreeningRepository {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  }

  async screening(
    application_id: number,
    job_post_id: number,
    custom_requirement?: string,
  ): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/job-posts/${job_post_id}/screening`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ application_id, custom_requirement: custom_requirement || null }),
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  }
}

// Export singleton instance
export const screeningRepository = new ScreeningRepository();
