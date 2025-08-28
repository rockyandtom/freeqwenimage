# FreeQwenImage AI Tools Platform

A comprehensive AI-powered tools collection platform featuring text-to-image generation, image enhancement, image-to-image transformation, and image-to-video conversion capabilities.

![preview](preview.png)

## 🚀 Features

### AI Tools Collection
- **Text to Image**: Generate stunning images from text descriptions
- **Image to Image**: Transform existing images with AI-powered modifications
- **Image Enhancer**: Enhance image quality and resolution
- **Image to Video**: Convert static images into dynamic videos

### Platform Features
- **Unified Interface**: Seamless navigation between all AI tools
- **Mobile Optimized**: Responsive design for all devices
- **Multi-language Support**: Available in English, Chinese, Japanese, and Korean
- **Real-time Processing**: Live progress tracking and status updates
- **High Performance**: Optimized for speed and reliability

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.7+
- **Styling**: Tailwind CSS 4.1+
- **UI Components**: shadcn/ui + Radix UI
- **Internationalization**: next-intl
- **AI Provider**: RunningHub API
- **Deployment**: Vercel

## 📦 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd freeqwenimage
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env.development
```

Edit `.env.development` and configure:
```env
# RunningHub API Configuration
RUNNINGHUB_API_URL=your_api_url
RUNNINGHUB_API_KEY=your_api_key

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── [locale]/(default)/       # Internationalized routes
│   │   ├── ai-tools/            # AI tools pages
│   │   │   ├── page.tsx         # Tools collection page
│   │   │   ├── image/           # Image tools
│   │   │   └── video/           # Video tools
│   │   └── page.tsx             # Homepage
│   └── api/                     # API routes
│       ├── runninghubAPI/       # RunningHub API integration
│       └── tools/               # Tools management API
├── components/                   # React components
│   ├── tools/                   # Tool-specific components
│   ├── ai-tools/               # Platform components
│   ├── ui/                     # UI components
│   └── blocks/                 # Page blocks
├── config/                      # Configuration files
│   ├── tools.ts                # Tools configuration
│   └── site.ts                 # Site configuration
├── hooks/                       # Custom React hooks
├── lib/                        # Utility libraries
├── types/                      # TypeScript type definitions
└── i18n/                       # Internationalization
```

## 🔧 Configuration

### Adding New AI Tools

1. Update the tools configuration in `src/config/tools.ts`:
```typescript
export const TOOLS_CONFIG: ToolConfig[] = [
  {
    id: 'your-new-tool',
    name: 'Your New Tool',
    description: 'Tool description',
    category: 'image',
    href: '/ai-tools/image/your-new-tool',
    apiEndpoint: '/api/runninghubAPI/your-new-tool',
    // ... other configuration
  }
];
```

2. Create the API route in `src/app/api/runninghubAPI/your-new-tool/route.ts`

3. Create the tool component in `src/components/tools/your-new-tool/`

4. Create the page in `src/app/[locale]/(default)/ai-tools/image/your-new-tool/page.tsx`

### Customizing Themes

Edit your theme in `src/app/theme.css` or use [tweakcn](https://tweakcn.com/editor/theme) for visual customization.

### Internationalization

Add translations in `src/i18n/messages/` and page-specific content in `src/i18n/pages/`.

## 🧪 Testing

### Run Tests
```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# API tests
pnpm test:api

# All tests
pnpm test:all
```

### Test Coverage
- Unit tests for components and hooks
- Integration tests for API endpoints
- End-to-end tests for user workflows
- Performance and mobile compatibility tests

## 📊 Performance

### Optimization Features
- Code splitting and lazy loading
- Image and video optimization
- API response caching
- Progressive loading states
- Mobile-first responsive design

### Performance Metrics
- Page load time: < 2 seconds
- API response time: < 500ms
- Mobile performance score: 90+
- Accessibility score: 95+

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

### Manual Deployment

1. Build the project
```bash
pnpm build
```

2. Start the production server
```bash
pnpm start
```

### Environment Variables for Production

```env
# Production API Configuration
RUNNINGHUB_API_URL=https://your-production-api.com
RUNNINGHUB_API_KEY=your_production_api_key

# Authentication
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://your-domain.com

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## 📚 API Documentation

### Available Endpoints

- `POST /api/runninghubAPI/text-to-image` - Generate images from text
- `POST /api/runninghubAPI/image-to-image` - Transform images
- `POST /api/runninghubAPI/image-enhancer` - Enhance image quality
- `POST /api/runninghubAPI/image-to-video` - Convert images to videos
- `GET /api/tools/list` - Get available tools
- `GET /api/runninghubAPI/status/:taskId` - Check task status

### API Response Format

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
  message?: string;
}
```

## 🔍 Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Verify your RunningHub API credentials
   - Check network connectivity
   - Review API endpoint URLs

2. **Build Errors**
   - Clear `.next` cache: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && pnpm install`
   - Check TypeScript errors: `pnpm type-check`

3. **Performance Issues**
   - Enable production optimizations
   - Check image sizes and formats
   - Review API response times

For detailed troubleshooting, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](docs/)
- 🐛 [Issue Tracker](https://github.com/your-repo/issues)
- 💬 [Discussions](https://github.com/your-repo/discussions)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- AI capabilities powered by [RunningHub](https://runninghub.ai/)
- Based on [ShipAny Template](https://shipany.ai/)
