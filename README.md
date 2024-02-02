# React + TypeScript + FFmpeg - Video Editor

## Tooling used:

- React
- TypeScript
- FFmpeg
- Tailwind CSS
- Vite
- Pnpm

## To run this project:

##### I have provided a .zip file that contains two videos, main and intro, one image, and one transcript file. Those where used to test the application. The application works with any .mp4 video file, but take special attention to the transcript file, if you want to use a different one, it must match the same format, I didn't protect the app to validade if the format is the correct one.

- pnpm install
- pnpm dev

## Use the application

- The first screen is a modal with two mandatory uploads, video and transcript.
- After uploading the files, the user is redirected to the editor screen.
- The editor screen has a video player, a text area, and a button to generate the final video.
- The user can trim the video, add an watermark image and add an intro video to the main.
- In the transcript area, the user can remove sentences from there, and the video will be updated in real-time to reflete this change.
- While the user is triming the video, the transcript also is updated the reflect the trimmed video.
- The application has the minimun responsive design to be used in a mobile device as weel in a dektop size screen.
