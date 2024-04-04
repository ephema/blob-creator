# [Blob Creator](https://blobs.ephema.io)

Making blobs accessible to everyone ✨

## Getting Started

To run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Notes

We've inlined the [kzg-wasm](https://github.com/ethereumjs/kzg-wasm) package to work around some problems with Next.JS. The package is mostly kept the same, except for commenting out some Node code that is not needed in the browser.
