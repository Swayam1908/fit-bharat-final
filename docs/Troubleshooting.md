# Troubleshooting Guide

This guide highlights common compilation errors and how to resolve them.

---

## 1. Webpack Cache Pack Gzip Errors
Next.js local servers can sometimes encounter caching conflicts if `npm run dev` and `npm run build` are run simultaneously.

* **Symptom**:
  ```
  Error: Cannot find module './2.pack.gz'
  ```
* **Solution**: Clean the cached files and restart the local dev process:
  ```bash
  npm run clean
  npm run dev
  ```

---

## 2. PageNotFoundError during Prerendering
* **Symptom**: Next.js reports `ENOENT` for routes like `/nutrition` or `/splash` during page data collection.
* **Solution**: A cached development build structure is conflicting. Delete `.next` using the clean script, and re-run build:
  ```bash
  npm run clean
  npm run build
  ```
