# Certificate Images

This directory contains certificate images that can be displayed in the portfolio.

## Supported formats:

- PNG
- JPG/JPEG
- WebP

## Naming convention:

- Use descriptive names: `aws-saa.png`, `azure-devops.png`
- Keep file sizes reasonable (< 2MB per image)
- Recommended dimensions: 1200x900px or similar aspect ratio

## Adding new certificates:

1. Save certificate image in this directory
2. Update the corresponding entry in `data/certificates.json`
3. Set the `image` field to the relative path: `certificates/your-cert.png`

## Example:

```json
{
  "title": "AWS Solutions Architect",
  "image": "certificates/aws-saa.png"
}
```
