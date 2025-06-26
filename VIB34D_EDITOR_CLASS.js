/**
 * VIB34D Editor Dashboard Class - Extracted to separate file
 */

// Editor Dashboard System
class VIB34DEditorDashboard {
    constructor() {
        this.elements = new Map();
        this.selectedElement = null;
        this.nextElementId = 1;
        this.relationships = new Map();
        this.isPreviewMode = false;
        
        // Initialize integrated system bridge
        this.systemBridge = null;
        this.initializeSystemBridge();
        
        this.initialize();
    }
    
    async initializeSystemBridge() {
        try {
            if (window.VIB34DIntegratedSystemBridge) {
                this.systemBridge = new VIB34DIntegratedSystemBridge();
                await this.systemBridge.initialize();
                console.log('✅ Integrated system bridge connected to editor');
            } else {
                console.warn('⚠️ Integrated system bridge not available');
            }
        } catch (error) {
            console.error('Failed to initialize system bridge:', error);
        }
    }
    
    initialize() {
        this.setupDragAndDrop();
        this.setupPropertyControls();
        this.setupCanvasInteraction();
        
        console.log('🎨 VIB34D Editor Dashboard initialized');
    }
    
    setupDragAndDrop() {
        // Setup drag from element library
        const elementItems = document.querySelectorAll('.element-item');
        elementItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    type: item.dataset.type,
                    geometry: item.dataset.geometry,
                    name: item.querySelector('.element-name').textContent
                }));
            });
        });
        
        // Setup drop on canvas
        const canvas = document.getElementById('canvas-workspace');
        const canvasContent = document.getElementById('canvas-content');
        
        canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            canvas.classList.add('drag-over');
        });
        
        canvas.addEventListener('dragleave', () => {
            canvas.classList.remove('drag-over');
        });
        
        canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            canvas.classList.remove('drag-over');
            
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            const rect = canvasContent.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.createElement(data, x, y);
        });
    }
    
    createElement(data, x, y) {
        const elementId = `element-${this.nextElementId++}`;
        
        // Create DOM element
        const element = document.createElement('div');
        element.className = 'dropped-element';
        element.id = elementId;
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.innerHTML = `
            <div>${data.name}</div>
            <div style="font-size: 10px; color: #888;">${data.geometry}</div>
        `;
        
        // Add visualizer canvas
        const canvas = document.createElement('canvas');
        canvas.className = 'element-visualizer';
        canvas.width = 200;
        canvas.height = 120;
        element.appendChild(canvas);
        
        // Make draggable
        element.draggable = true;
        element.addEventListener('dragstart', (e) => {
            // Implement moving existing elements
        });
        
        // Make selectable
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectElement(elementId);
        });
        
        document.getElementById('canvas-content').appendChild(element);
        
        // Create element data
        const elementData = {
            id: elementId,
            type: data.type,
            geometry: data.geometry,
            name: data.name,
            position: { x, y },
            visualizer: null,
            properties: {
                dimension: 4.0,
                morphFactor: 0.7,
                gridDensity: 8.0,
                rotationSpeed: 0.5,
                hoverIntensity: 1.0,
                clickResponse: 1.2,
                scrollSensitivity: 0.8
            },
            relationships: {
                type: 'none',
                strength: 0.5,
                targets: []
            }
        };
        
        this.elements.set(elementId, elementData);
        
        // Initialize visualizer
        this.initializeElementVisualizer(elementData, canvas);
        
        // Register with integrated system bridge
        if (this.systemBridge) {
            this.systemBridge.registerElement(elementData);
        }
        
        // Auto-select new element
        this.selectElement(elementId);
        
        console.log(`Created ${data.type} element with ${data.geometry} geometry`);
    }
    
    initializeElementVisualizer(elementData, canvas) {
        try {
            // Direct WebGL implementation - NO FALLBACKS
            if (window.VIB34D_WorkingCore) {
                console.log(`🚀 Creating WebGL visualizer for ${elementData.id}`);
                
                // Select appropriate geometry class
                let GeometryClass;
                switch(elementData.geometry) {
                    case 'hypercube': GeometryClass = window.VIB34D_WorkingCore.HypercubeGeometry; break;
                    case 'sphere': GeometryClass = window.VIB34D_WorkingCore.HypersphereGeometry; break;
                    case 'torus': GeometryClass = window.VIB34D_WorkingCore.TorusGeometry; break;
                    case 'klein': GeometryClass = window.VIB34D_WorkingCore.KleinBottleGeometry; break;
                    case 'mobius': GeometryClass = window.VIB34D_WorkingCore.MobiusGeometry; break;
                    case 'lorenz': GeometryClass = window.VIB34D_WorkingCore.LorenzAttractorGeometry; break;
                    case 'hopf': GeometryClass = window.VIB34D_WorkingCore.HopfLinkGeometry; break;
                    case 'tesseract': GeometryClass = window.VIB34D_WorkingCore.TesseractGeometry; break;
                    default: GeometryClass = window.VIB34D_WorkingCore.HypercubeGeometry;
                }
                
                // Create the core with proper geometry
                const core = new window.VIB34D_WorkingCore.HypercubeCore(canvas, {
                    geometry: new GeometryClass(),
                    initialUniforms: {
                        u_dimension: elementData.properties.dimension,
                        u_morphFactor: elementData.properties.morphFactor,
                        u_gridDensity: elementData.properties.gridDensity,
                        u_rotationSpeed: elementData.properties.rotationSpeed
                    }
                });
                
                // Configure based on element properties
                core.updateParameters({
                    geometryType: elementData.geometry,
                    projectionMethod: 'perspective',
                    dimension: elementData.properties.dimension,
                    morphFactor: elementData.properties.morphFactor,
                    gridDensity: elementData.properties.gridDensity,
                    rotationSpeed: elementData.properties.rotationSpeed,
                    patternIntensity: 1.5,
                    lineThickness: 0.03,
                    glitchIntensity: 0.02
                });
                
                // Start the visualization
                core.start();
                
                // Store reference
                elementData.visualizer = core;
                element.classList.add('has-visualizer');
                
                console.log(`✅ WebGL visualizer created for ${elementData.id}`);
                
            } else {
                console.warn(`⚠️ VIB34D Working Core not available for ${elementData.id}`);
            }
            
        } catch (error) {
            console.error(`❌ Failed to initialize visualizer for ${elementData.id}:`, error);
        }
    }
    
    selectElement(elementId) {
        // Deselect previous
        if (this.selectedElement) {
            const prevElement = document.getElementById(this.selectedElement);
            if (prevElement) {
                prevElement.classList.remove('selected');
            }
        }
        
        // Select new
        this.selectedElement = elementId;
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('selected');
        }
        
        // Update properties panel
        this.updatePropertiesPanel(elementId);
        
        // Generate code preview
        this.generateCodePreview(elementId);
    }
    
    updatePropertiesPanel(elementId) {
        const elementData = this.elements.get(elementId);
        if (!elementData) return;
        
        // Update basic properties
        document.getElementById('element-properties').innerHTML = `
            <div class="property-group">
                <label class="property-label">Element Type</label>
                <input type="text" class="property-input" value="${elementData.type}" readonly>
            </div>
            <div class="property-group">
                <label class="property-label">Element Name</label>
                <input type="text" class="property-input" value="${elementData.name}" onchange="window.editorDashboard.updateElementName('${elementId}', this.value)">
            </div>
            <div class="property-group">
                <label class="property-label">Position X</label>
                <input type="number" class="property-input" value="${elementData.position.x}" onchange="window.editorDashboard.updateElementPosition('${elementId}', 'x', this.value)">
            </div>
            <div class="property-group">
                <label class="property-label">Position Y</label>
                <input type="number" class="property-input" value="${elementData.position.y}" onchange="window.editorDashboard.updateElementPosition('${elementId}', 'y', this.value)">
            </div>
        `;
        
        // Update visualizer settings
        document.getElementById('dimension-slider').value = elementData.properties.dimension;
        document.getElementById('dimension-value').textContent = elementData.properties.dimension.toFixed(1);
        
        document.getElementById('morph-slider').value = elementData.properties.morphFactor;
        document.getElementById('morph-value').textContent = elementData.properties.morphFactor.toFixed(2);
        
        document.getElementById('grid-slider').value = elementData.properties.gridDensity;
        document.getElementById('grid-value').textContent = elementData.properties.gridDensity.toFixed(1);
        
        document.getElementById('rotation-slider').value = elementData.properties.rotationSpeed;
        document.getElementById('rotation-value').textContent = elementData.properties.rotationSpeed.toFixed(2);
        
        // Update reactivity settings
        document.getElementById('hover-intensity').value = elementData.properties.hoverIntensity;
        document.getElementById('hover-intensity-value').textContent = elementData.properties.hoverIntensity.toFixed(1);
        
        document.getElementById('click-response').value = elementData.properties.clickResponse;
        document.getElementById('click-response-value').textContent = elementData.properties.clickResponse.toFixed(1);
        
        document.getElementById('scroll-sensitivity').value = elementData.properties.scrollSensitivity;
        document.getElementById('scroll-sensitivity-value').textContent = elementData.properties.scrollSensitivity.toFixed(1);
        
        // Update relationships
        document.getElementById('relationship-type').value = elementData.relationships.type;
        document.getElementById('relationship-strength').value = elementData.relationships.strength;
        document.getElementById('relationship-strength-value').textContent = elementData.relationships.strength.toFixed(1);
    }
    
    generateCodePreview(elementId) {
        const elementData = this.elements.get(elementId);
        if (!elementData) return;
        
        const code = `
// ${elementData.name} (${elementData.type})
const ${elementId}Config = {
    type: "${elementData.type}",
    geometry: "${elementData.geometry}",
    position: { x: ${elementData.position.x}, y: ${elementData.position.y} },
    visualizer: {
        dimension: ${elementData.properties.dimension},
        morphFactor: ${elementData.properties.morphFactor},
        gridDensity: ${elementData.properties.gridDensity},
        rotationSpeed: ${elementData.properties.rotationSpeed}
    },
    reactivity: {
        hover: ${elementData.properties.hoverIntensity},
        click: ${elementData.properties.clickResponse},
        scroll: ${elementData.properties.scrollSensitivity}
    },
    relationships: {
        type: "${elementData.relationships.type}",
        strength: ${elementData.relationships.strength}
    }
};

// Apply to element
applyVIB34DConfig('${elementId}', ${elementId}Config);
        `.trim();
        
        document.getElementById('code-output').textContent = code;
    }
    
    setupPropertyControls() {
        // Setup property control handlers
        const sliders = ['dimension', 'morph', 'grid', 'rotation'];
        
        sliders.forEach(slider => {
            const sliderElement = document.getElementById(`${slider}-slider`);
            const valueElement = document.getElementById(`${slider}-value`);
            
            if (sliderElement && valueElement) {
                sliderElement.addEventListener('input', () => {
                    const value = parseFloat(sliderElement.value);
                    valueElement.textContent = value.toFixed(slider === 'morph' || slider === 'rotation' ? 2 : 1);
                    
                    if (this.selectedElement) {
                        this.updateElementProperty(this.selectedElement, slider, value);
                    }
                });
            }
        });
        
        // Setup reactivity sliders
        const reactivitySliders = ['hover-intensity', 'click-response', 'scroll-sensitivity'];
        
        reactivitySliders.forEach(slider => {
            const sliderElement = document.getElementById(slider);
            const valueElement = document.getElementById(`${slider}-value`);
            
            if (sliderElement && valueElement) {
                sliderElement.addEventListener('input', () => {
                    const value = parseFloat(sliderElement.value);
                    valueElement.textContent = value.toFixed(1);
                    
                    if (this.selectedElement) {
                        this.updateElementReactivity(this.selectedElement, slider, value);
                    }
                });
            }
        });
    }
    
    setupCanvasInteraction() {
        // Canvas click to deselect
        document.getElementById('canvas-content').addEventListener('click', () => {
            this.deselectAll();
        });
        
        // Delete key handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' && this.selectedElement) {
                this.deleteElement(this.selectedElement);
            }
        });
    }
    
    updateElementProperty(elementId, property, value) {
        const elementData = this.elements.get(elementId);
        if (!elementData) return;
        
        const propertyMap = {
            'dimension': 'dimension',
            'morph': 'morphFactor',
            'grid': 'gridDensity',
            'rotation': 'rotationSpeed'
        };
        
        const actualProperty = propertyMap[property];
        if (actualProperty) {
            elementData.properties[actualProperty] = value;
            
            // Update visualizer if available
            if (elementData.visualizer) {
                const updates = {};
                updates[actualProperty] = value;
                elementData.visualizer.updateParameters(updates);
            }
            
            // Regenerate code preview
            this.generateCodePreview(elementId);
        }
    }
    
    updateElementReactivity(elementId, property, value) {
        const elementData = this.elements.get(elementId);
        if (!elementData) return;
        
        const propertyMap = {
            'hover-intensity': 'hoverIntensity',
            'click-response': 'clickResponse',
            'scroll-sensitivity': 'scrollSensitivity'
        };
        
        const actualProperty = propertyMap[property];
        if (actualProperty) {
            elementData.properties[actualProperty] = value;
            
            // Regenerate code preview
            this.generateCodePreview(elementId);
        }
    }
    
    deleteElement(elementId) {
        if (confirm(`Delete element ${this.selectedElement}?`)) {
            const elementData = this.elements.get(elementId);
            
            console.log(`🗑️ Deleted element: ${elementId}`);
            
            // Dispose visualizer
            this.disposeElement(elementId);
            
            // Remove from DOM
            const element = document.getElementById(elementId);
            if (element) {
                element.remove();
            }
            
            // Remove from elements map
            this.elements.delete(elementId);
            
            // Clear selection
            this.selectedElement = null;
            this.updatePropertiesPanel('');
            
            console.log(`🗑️ Element ${elementId} completely disposed`);
        }
    }
    
    disposeElement(elementId) {
        const elementData = this.elements.get(elementId);
        if (!elementData) return;
        
        console.log(`🧹 Disposing element: ${elementId}`);
        
        try {
            // Stop and dispose visualizer
            if (elementData.visualizer) {
                if (typeof elementData.visualizer.stop === 'function') {
                    elementData.visualizer.stop();
                }
                
                if (typeof elementData.visualizer.dispose === 'function') {
                    elementData.visualizer.dispose();
                }
                
                // Clear canvas
                const canvas = document.querySelector(`#${elementId} canvas`);
                if (canvas) {
                    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                    if (gl) {
                        // Clear WebGL context
                        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                    }
                    
                    // Clear 2D context
                    const ctx2d = canvas.getContext('2d');
                    if (ctx2d) {
                        ctx2d.clearRect(0, 0, canvas.width, canvas.height);
                    }
                }
                
                elementData.visualizer = null;
                console.log(`✅ Visualizer disposed for: ${elementId}`);
            } else {
                console.warn(`⚠️ Error disposing visualizer for ${elementId}:`, error);
            }
        } catch (error) {
            console.error(`❌ Error disposing element ${elementId}:`, error);
        }
    }
    
    disposeAllElements() {
        console.log('🧹 Disposing all elements...');
        
        let disposedCount = 0;
        this.elements.forEach((elementData, elementId) => {
            this.disposeElement(elementId);
            disposedCount++;
        });
        
        // Clear elements map
        this.elements.clear();
        
        console.log(`✅ Disposed ${disposedCount} elements, memory cleanup complete`);
    }
    
    deselectAll() {
        if (this.selectedElement) {
            const element = document.getElementById(this.selectedElement);
            if (element) {
                element.classList.remove('selected');
            }
            this.selectedElement = null;
            
            // Clear properties panel
            document.getElementById('element-properties').innerHTML = `
                <div style="color: #888; text-align: center; padding: 20px;">
                    Select an element to edit its properties
                </div>
            `;
            
            // Clear code output
            document.getElementById('code-output').textContent = '// Select elements to see generated code';
        }
    }
}

// Export to window for global access
window.VIB34DEditorDashboard = VIB34DEditorDashboard;