export interface GoogleFactCheckResult {
  text: string;
  claimant: string;
  claimDate: string;
  claimReview: {
    publisher: { name: string; site: string };
    url: string;
    title: string;
    reviewDate: string;
    textualRating: string;
    languageCode: string;
  }[];
}

export interface GoogleFactCheckResponse {
  claims?: GoogleFactCheckResult[];
  nextPageToken?: string;
}

export async function searchFactChecks(query: string, apiKey: string): Promise<string> {
  if (!apiKey || !query.trim()) return '';

  // Limit query length and sanitize a bit to improve search results
  // The Fact Check API expects concise queries
  const conciseQuery = query.split(' ').slice(0, 15).join(' ');

  try {
    const response = await fetch(
      `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(conciseQuery)}&key=${apiKey}`
    );

    if (!response.ok) {
      console.warn('Failed to fetch from Google Fact Check API', response.status);
      return '';
    }

    const data: GoogleFactCheckResponse = await response.json();
    
    if (!data.claims || data.claims.length === 0) {
      return '';
    }

    // Format the top 3 claims into a concise context string for OpenAI
    const topClaims = data.claims.slice(0, 3);
    
    let contextString = 'VERIFIED FACT CHECKS FROM GOOGLE FACT CHECK API:\n';
    
    topClaims.forEach((claim, index) => {
      contextString += `[Fact Check ${index + 1}]\n`;
      contextString += `- Claim: "${claim.text}"\n`;
      if (claim.claimant) contextString += `- Claim made by: ${claim.claimant}\n`;
      
      claim.claimReview?.slice(0, 2).forEach(review => {
        contextString += `- Rating by ${review.publisher?.name || 'Reviewer'}: ${review.textualRating}\n`;
        contextString += `- Source URL: ${review.url}\n`;
      });
      contextString += '\n';
    });

    return contextString;
  } catch (error) {
    console.warn('Error calling Google Fact Check API:', error);
    return ''; // Fail silently so we don't block the main OpenAI flow
  }
}
