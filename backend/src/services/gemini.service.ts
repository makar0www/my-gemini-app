export async function generateImage(prompt: string) {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0:generateImage?key=" + process.env.GEMINI_API_KEY;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: {
        text: prompt
      },
      image: {
        height: 1024,
        width: 1024
      }
    })
  });

  const data = await response.json();

  // base64 изображения
  return data.images[0].data;
}

