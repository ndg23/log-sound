# Contributing to log-sound

We love your input! We want to make contributing to log-sound as easy and transparent as possible.

## Development Process

1. Fork the repo and create your branch from `main`.
2. Install dependencies: `npm install`
3. Add your changes
4. Add tests for your changes
5. Make sure tests pass: `npm test`
6. Push to your fork and submit a pull request

## Project Structure

```
log-sound/
├── sounds/          # Default sound files
├── examples/        # Usage examples
├── tests/          # Test files
├── error.js        # Main library file
├── package.json    # Project configuration
└── README.md       # Documentation
```

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Run demo
npm run demo
```

## Sound Files

- Add new sound files to the `sounds/` directory
- Use MP3 format for maximum compatibility
- Keep file sizes small (< 100KB recommended)

## Coding Style

- Use ES6+ features
- Follow existing code style
- Add JSDoc comments for new methods
- Keep methods focused and small

## Pull Request Process

1. Update the README.md with details of changes
2. Update the tests for any changed functionality
3. Update the demo if adding new features
4. The PR will be merged once you have the sign-off
