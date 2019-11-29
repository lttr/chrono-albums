export default {
  title: 'Photo albums',
  marginPercent: 0.1,
  photosFolderName: 'photos',
  resolutions: {
    placeholder: 30,
    thumbnail: 320,
    small: 640,
    medium: 1024,
    large: 1920,
  },
  jpegOptions: {
    quality: 80,
    progressive: true,
    optimizeScans: true,
  },
  webpOptions: {
    quality: 80,
  },
  justifiedLayoutOptions: {
    containerWidth: 1180,
    containerPadding: 0,
    boxSpacing: 4,
    targetRowHeight: 320,
    targetRowHeightTolerance: 0.2,
  },
}
