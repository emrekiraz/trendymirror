import { NextResponse } from 'next/server'
import axios from 'axios'

const FREEPIK_API_KEY = process.env.FREEPIK_API_KEY?.trim() || 'temporary-placeholder'

// Sample model images to use as fallbacks when API is not available
const SAMPLE_MODEL_IMAGES = [
  '/api/image-proxy?bucket=models&name=default/TrendyMirror_1.png',
  '/api/image-proxy?bucket=models&name=default/TrendyMirror_2.png',
  '/api/image-proxy?bucket=models&name=default/TrendyMirror_13.png',
  '/api/image-proxy?bucket=models&name=default/TrendyMirror_6.png',
];

// Check if API key is properly set
const isApiKeyValid = FREEPIK_API_KEY && FREEPIK_API_KEY !== 'temporary-placeholder';

if (!isApiKeyValid) {
  console.warn('FREEPIK_API_KEY environment variable is not properly set, using fallback images')
}

// Helper function to get a base64 image from a URL
async function getImageAsBase64(imageUrl: string): Promise<string> {
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error('Error fetching image:', error);
    // Return a colored placeholder if image fetch fails
    return 'data:image/png;base64,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';
  }
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    console.log('AI model generation request with prompt:', prompt)

    // If API key is not valid, use the fallback image service
    if (!isApiKeyValid) {
      console.log('Using fallback image service instead of actual API')
      // Get a random sample image
      const randomIndex = Math.floor(Math.random() * SAMPLE_MODEL_IMAGES.length)
      const randomImageUrl = SAMPLE_MODEL_IMAGES[randomIndex]
      
      try {
        console.log('Fetching sample image:', randomImageUrl)
        const base64Image = await getImageAsBase64(randomImageUrl)
        
        return NextResponse.json({ 
          base64Image,
          _note: 'Using sample image as fallback because API key is not configured' 
        })
      } catch (imageError) {
        console.error('Error fetching sample image:', imageError)
        return NextResponse.json(
          { error: 'Failed to generate image with fallback service' },
          { status: 500 }
        )
      }
    }

    // Actual API code starts here
    console.log('Making request to Freepik API with prompt:', prompt)

    // Using the updated Freepik AI image generation endpoint with the new format
    const response = await axios.post(
      'https://api.freepik.com/v1/ai/text-to-image/flux-dev',
      {
        prompt,
        aspect_ratio: "traditional_3_4",
        styling: {
          effects: {
            camera: "portrait"
          }
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-freepik-api-key': FREEPIK_API_KEY
        }
      }
    )

    console.log('Freepik API response received:', response.data)

    // The new API returns a task_id that we need to poll for the result
    if (response.data && response.data.data && response.data.data.task_id) {
      const taskId = response.data.data.task_id
      
      // Poll for the result (in a real implementation, you might want to use a webhook instead)
      let imageUrl = null
      let attempts = 0
      const maxAttempts = 30
      const pollingInterval = 2000 // 2 seconds
      
      while (!imageUrl && attempts < maxAttempts) {
        attempts++
        console.log(`Polling for result, attempt ${attempts}/${maxAttempts}`)
        
        try {
          // Wait for the polling interval
          await new Promise(resolve => setTimeout(resolve, pollingInterval))
          
          // Check the status of the task
          const statusResponse = await axios.get(
            `https://api.freepik.com/v1/ai/text-to-image/flux-dev/${taskId}`,
            {
              headers: {
                'x-freepik-api-key': FREEPIK_API_KEY
              }
            }
          )
          
          console.log(`Status check response:`, statusResponse.data)
          
          if (statusResponse.data.data.status === 'COMPLETED' && statusResponse.data.data.generated && statusResponse.data.data.generated.length > 0) {
            // Get the image URL from the response
            imageUrl = statusResponse.data.data.generated[0]
            break
          } else if (statusResponse.data.data.status === 'FAILED') {
            throw new Error('Image generation failed')
          }
          
          // If still in progress, continue polling
        } catch (pollingError) {
          console.error('Error polling for result:', pollingError)
          throw pollingError
        }
      }
      
      if (!imageUrl) {
        throw new Error('Timed out waiting for image generation')
      }
      
      // Fetch the image from the URL and convert it to base64
      try {
        console.log('Fetching image from URL:', imageUrl)
        const imageResponse = await axios.get(imageUrl, {
          responseType: 'arraybuffer'
        })
        
        // Convert the image to base64
        const base64Image = Buffer.from(imageResponse.data, 'binary').toString('base64')
        
        return NextResponse.json({ 
          base64Image: `data:image/jpeg;base64,${base64Image}` 
        })
      } catch (imageError) {
        console.error('Error fetching image from URL:', imageError)
        throw new Error('Failed to fetch generated image')
      }
    } else {
      console.error('Invalid response format from Freepik API')
      return NextResponse.json(
        { error: 'Failed to generate image' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    })

    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key or unauthorized access' },
        { status: 401 }
      )
    }

    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: 'API endpoint not found. Please check the API URL.' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to generate image' },
      { status: error.response?.status || 500 }
    )
  }
} 