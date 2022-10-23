import { defineConfig } from "vite"

export default defineConfig({
    assetsInclude: "exoframe.json",
    build: {
        emptyOutDir: false
    }
})