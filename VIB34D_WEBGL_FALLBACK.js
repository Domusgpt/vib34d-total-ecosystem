/**
 * VIB34D WEBGL FALLBACK SYSTEM
 * 
 * Provides fallback functionality when WebGL is not available
 * Implements canvas-based rendering for 4D visualizations
 */

// ============================================================================
// 🎮 WEBGL DETECTION AND FALLBACK MANAGEMENT
// ============================================================================

class VIB34DWebGLFallback {
    constructor() {
        this.webglSupported = this.detectWebGL();
        this.canvas2d = null;
        this.ctx = null;
        this.animationFrame = null;
        
        console.log(`🎮 WebGL Support: ${this.webglSupported ? 'Available' : 'Fallback Mode'}`);
    }
    
    detectWebGL() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return !!gl;
        } catch (e) {
            return false;
        }
    }
    
    initializeFallback(canvasElement) {
        if (this.webglSupported) {
            console.log('✅ WebGL available - no fallback needed');
            return false;
        }
        
        console.log('🔄 Initializing Canvas 2D fallback...');
        this.canvas2d = canvasElement;
        this.ctx = this.canvas2d.getContext('2d');
        
        // Set up fallback styling
        this.ctx.fillStyle = '#000';
        this.ctx.strokeStyle = '#00ffff';
        this.ctx.lineWidth = 1;
        
        return true;
    }
    
    renderFallback(elementData) {
        if (!this.ctx || this.webglSupported) return;
        
        const { width, height } = this.canvas2d;
        
        // Clear canvas
        this.ctx.fillRect(0, 0, width, height);
        
        // Draw basic geometric patterns as fallback
        const centerX = width / 2;
        const centerY = height / 2;
        const time = Date.now() * 0.001;
        
        // Draw rotating wireframe cube projection
        this.drawWireframeCube(centerX, centerY, time, elementData);
        
        // Draw grid pattern
        this.drawGrid(width, height, time);
        
        // Draw status text
        this.drawFallbackText();
    }
    
    drawWireframeCube(centerX, centerY, time, elementData) {
        const size = (elementData?.properties?.dimension || 3) * 30;
        const rotation = time * (elementData?.properties?.rotationSpeed || 1);
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(rotation);
        
        // Draw cube wireframe
        const points = [
            [-size, -size], [size, -size], [size, size], [-size, size],  // front face
            [-size*0.7, -size*0.7], [size*0.7, -size*0.7], [size*0.7, size*0.7], [-size*0.7, size*0.7] // back face (projected)
        ];
        
        // Front face
        this.ctx.beginPath();
        this.ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < 4; i++) {
            this.ctx.lineTo(points[i][0], points[i][1]);
        }
        this.ctx.closePath();
        this.ctx.stroke();
        
        // Back face
        this.ctx.beginPath();
        this.ctx.moveTo(points[4][0], points[4][1]);
        for (let i = 5; i < 8; i++) {
            this.ctx.lineTo(points[i][0], points[i][1]);
        }
        this.ctx.closePath();
        this.ctx.stroke();
        
        // Connect front to back
        for (let i = 0; i < 4; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(points[i][0], points[i][1]);
            this.ctx.lineTo(points[i+4][0], points[i+4][1]);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    drawGrid(width, height, time) {
        const gridSize = 40;
        const offset = (time * 20) % gridSize;
        
        this.ctx.save();
        this.ctx.strokeStyle = '#003333';
        this.ctx.lineWidth = 0.5;
        
        // Vertical lines
        for (let x = -offset; x < width + gridSize; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = -offset; y < height + gridSize; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    drawFallbackText() {
        this.ctx.save();
        this.ctx.fillStyle = '#00ffff';
        this.ctx.font = '14px "Courier New", monospace';
        this.ctx.fillText('🔄 Canvas 2D Fallback Mode', 10, 25);
        this.ctx.fillText('WebGL not available - using basic rendering', 10, 45);
        this.ctx.restore();
    }
    
    startFallbackAnimation(elementData) {
        if (!this.ctx || this.webglSupported) return;
        
        const animate = () => {
            this.renderFallback(elementData);
            this.animationFrame = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    stopFallbackAnimation() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
    
    cleanup() {
        this.stopFallbackAnimation();
        this.canvas2d = null;
        this.ctx = null;
    }
}

// ============================================================================
// 🌐 GLOBAL FALLBACK INSTANCE
// ============================================================================

window.VIB34DWebGLFallback = VIB34DWebGLFallback;

// Auto-initialize if needed
if (typeof window !== 'undefined') {
    window.VIB34DWebGLFallback = VIB34DWebGLFallback; // Expose the class
    window.vib34dFallback = new VIB34DWebGLFallback(); // Expose an instance
    window.VIB34D_WEBGL_FALLBACK = window.vib34dFallback; // For test compatibility
    console.log('🎮 VIB34D WebGL Fallback System initialized');
}