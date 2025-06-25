/**
 * VIB34D WEARABLE UI ADAPTER
 * 
 * Adaptive system for scaling reactive UI from web to wearable to neural interfaces
 * Handles device-specific optimizations, biometric integration, and total feedback scaling
 * 
 * DEVICE SUPPORT:
 * - Smartwatches (limited screen, touch pressure)
 * - AR Glasses (spatial awareness, eye tracking)
 * - Neural Interfaces (thought patterns, direct feedback)
 * - Future wearables (haptic, environmental sensors)
 */

// ============================================================================
// 🌐 UNIVERSAL WEARABLE ADAPTER
// ============================================================================

class VIB34DWearableAdapter {
    constructor() {
        this.deviceProfiles = new WearableDeviceProfiles();
        this.biometricProcessor = new BiometricDataProcessor();
        this.spatialProcessor = new SpatialAwarenessProcessor();
        this.hapticEngine = new HapticFeedbackEngine();
        this.environmentProcessor = new EnvironmentalContextProcessor();
        this.neuralInterface = new NeuralInterfaceManager();
        
        // Auto-detect current device context
        this.currentDevice = this.detectDevice();
        this.capabilities = this.deviceProfiles.getCapabilities(this.currentDevice);
        
        console.log(`🌐 Wearable Adapter initialized for: ${this.currentDevice.type}`);
        console.log(`📱 Capabilities: ${JSON.stringify(this.capabilities, null, 2)}`);
    }
    
    // =======================================================================
    // DEVICE DETECTION AND ADAPTATION
    // =======================================================================
    
    detectDevice() {
        // Advanced device detection beyond basic user agent
        const device = {
            type: 'web', // Default fallback
            screenSize: { width: window.innerWidth, height: window.innerHeight },
            pixelDensity: window.devicePixelRatio || 1,
            inputMethods: [],
            sensors: [],
            biometricCapabilities: [],
            spatialCapabilities: [],
            performanceProfile: 'standard'
        };
        
        // Screen size heuristics
        const diagonal = Math.sqrt(device.screenSize.width ** 2 + device.screenSize.height ** 2);
        
        if (diagonal < 300) {
            device.type = 'smartwatch';
            device.performanceProfile = 'limited';
        } else if (this.detectARGlasses()) {
            device.type = 'ar_glasses';
            device.performanceProfile = 'high';
            device.spatialCapabilities = ['depth_sensing', 'environment_mapping', 'eye_tracking'];
        } else if (this.detectNeuralInterface()) {
            device.type = 'neural_interface';
            device.performanceProfile = 'extreme';
            device.biometricCapabilities = ['brain_activity', 'neural_patterns', 'thought_detection'];
        }
        
        // Detect available input methods
        device.inputMethods = this.detectInputMethods();
        
        // Detect available sensors
        device.sensors = this.detectSensors();
        
        return device;
    }
    
    detectInputMethods() {
        const methods = ['touch']; // Base assumption
        
        // Touch pressure detection
        if ('ontouchstart' in window && window.TouchEvent) {
            try {
                const testTouch = new TouchEvent('touchstart');
                if ('force' in testTouch) {
                    methods.push('pressure_touch');
                }
            } catch (e) {}
        }
        
        // Stylus detection
        if ('onpointerdown' in window) {
            methods.push('stylus');
        }
        
        // Voice detection
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            methods.push('voice');
        }
        
        // Gesture detection (basic)
        if ('DeviceMotionEvent' in window) {
            methods.push('device_motion');
        }
        
        // Eye tracking (AR glasses)
        if (this.hasWebXR() && this.detectARCapabilities()) {
            methods.push('eye_tracking');
        }
        
        return methods;
    }
    
    detectSensors() {
        const sensors = [];
        
        // Accelerometer
        if ('DeviceMotionEvent' in window) {
            sensors.push('accelerometer');
        }
        
        // Gyroscope
        if ('DeviceOrientationEvent' in window) {
            sensors.push('gyroscope');
        }
        
        // Heart rate (if available)
        if ('HeartRateSensor' in window || this.detectHeartRateCapability()) {
            sensors.push('heart_rate');
        }
        
        // Ambient light
        if ('AmbientLightSensor' in window) {
            sensors.push('ambient_light');
        }
        
        // Proximity
        if ('ProximitySensor' in window) {
            sensors.push('proximity');
        }
        
        return sensors;
    }
    
    // =======================================================================
    // ADAPTIVE UI CONFIGURATION
    // =======================================================================
    
    adaptConfigurationForDevice(standardConfig, targetDevice = null) {
        const device = targetDevice || this.currentDevice;
        const profile = this.deviceProfiles.get(device.type);
        
        const adaptedConfig = {
            ...standardConfig,
            deviceOptimizations: {
                originalComplexity: this.calculateComplexity(standardConfig),
                targetDevice: device.type,
                appliedOptimizations: []
            }
        };
        
        // Apply device-specific optimizations
        if (profile.maxParameters && this.getParameterCount(standardConfig) > profile.maxParameters) {
            adaptedConfig.parameters = this.reduceParameterComplexity(
                standardConfig.parameters, 
                profile.maxParameters
            );
            adaptedConfig.deviceOptimizations.appliedOptimizations.push('parameter_reduction');
        }
        
        // Optimize geometry selection
        if (profile.preferredGeometries && !profile.preferredGeometries.includes(standardConfig.geometry)) {
            adaptedConfig.geometry = this.selectOptimalGeometry(standardConfig.geometry, profile.preferredGeometries);
            adaptedConfig.deviceOptimizations.appliedOptimizations.push('geometry_optimization');
        }
        
        // Adapt interaction methods
        adaptedConfig.interactions = this.adaptInteractions(standardConfig.interactions, device);
        adaptedConfig.deviceOptimizations.appliedOptimizations.push('interaction_adaptation');
        
        // Configure device-specific features
        if (device.biometricCapabilities.length > 0) {
            adaptedConfig.biometricIntegration = this.configureBiometricIntegration(device.biometricCapabilities);
            adaptedConfig.deviceOptimizations.appliedOptimizations.push('biometric_integration');
        }
        
        if (device.spatialCapabilities.length > 0) {
            adaptedConfig.spatialAwareness = this.configureSpatialAwareness(device.spatialCapabilities);
            adaptedConfig.deviceOptimizations.appliedOptimizations.push('spatial_awareness');
        }
        
        return adaptedConfig;
    }
    
    adaptInteractions(standardInteractions, device) {
        const adapted = { ...standardInteractions };
        
        switch (device.type) {
            case 'smartwatch':
                // Optimize for small screen and touch pressure
                adapted.primary = 'touch_pressure';
                adapted.gestures = ['tap', 'swipe', 'crown_rotation'];
                adapted.biometric = ['heart_rate', 'stress_level'];
                break;
                
            case 'ar_glasses':
                // Optimize for spatial interaction and eye tracking
                adapted.primary = 'eye_tracking';
                adapted.gestures = ['air_tap', 'pinch', 'point', 'hand_tracking'];
                adapted.spatial = ['gaze_direction', 'head_orientation', 'spatial_mapping'];
                break;
                
            case 'neural_interface':
                // Direct neural control
                adapted.primary = 'thought_pattern';
                adapted.neural = ['intention_detection', 'emotional_state', 'attention_focus'];
                adapted.biometric = ['brain_activity', 'neural_synchrony'];
                break;
                
            default: // web
                // Standard web interactions
                adapted.primary = 'mouse';
                adapted.gestures = ['click', 'scroll', 'hover', 'drag'];
        }
        
        return adapted;
    }
    
    // =======================================================================
    // BIOMETRIC INTEGRATION
    // =======================================================================
    
    configureBiometricIntegration(capabilities) {
        const integration = {
            enabled: true,
            capabilities: capabilities,
            processors: {},
            parameterMappings: {}
        };
        
        capabilities.forEach(capability => {
            switch (capability) {
                case 'heart_rate':
                    integration.processors.heartRate = new HeartRateProcessor();
                    integration.parameterMappings.heartRate = {
                        u_biometric_stress: 'resting_hr_deviation',
                        u_energy: 'hr_variability',
                        u_rotationSpeed: 'hr_trend'
                    };
                    break;
                    
                case 'brain_activity':
                    integration.processors.brainActivity = new BrainActivityProcessor();
                    integration.parameterMappings.brainActivity = {
                        u_dimension: 'cognitive_load',
                        u_morphFactor: 'attention_focus',
                        u_patternIntensity: 'neural_synchrony'
                    };
                    break;
                    
                case 'stress_level':
                    integration.processors.stressLevel = new StressLevelProcessor();
                    integration.parameterMappings.stressLevel = {
                        u_glassOpacity: 'stress_transparency',
                        u_colorShift: 'stress_color_indication',
                        u_emergenceThreshold: 'stress_ui_simplification'
                    };
                    break;
            }
        });
        
        return integration;
    }
    
    processBiometricData(rawData, integrationType) {
        const processor = this.biometricProcessor.getProcessor(integrationType);
        if (!processor) return null;
        
        const processedData = processor.process(rawData);
        const parameterUpdates = this.mapBiometricToParameters(processedData, integrationType);
        
        return {
            processed: processedData,
            parameters: parameterUpdates,
            confidence: processedData.confidence || 0.8,
            timestamp: Date.now()
        };
    }
    
    // =======================================================================
    // SPATIAL AWARENESS INTEGRATION
    // =======================================================================
    
    configureSpatialAwareness(capabilities) {
        const spatial = {
            enabled: true,
            capabilities: capabilities,
            processors: {},
            environmentalContext: {}
        };
        
        capabilities.forEach(capability => {
            switch (capability) {
                case 'depth_sensing':
                    spatial.processors.depth = new DepthSensingProcessor();
                    spatial.environmentalContext.depth = {
                        nearObjects: [],
                        farObjects: [],
                        userDistance: 0
                    };
                    break;
                    
                case 'environment_mapping':
                    spatial.processors.environment = new EnvironmentMappingProcessor();
                    spatial.environmentalContext.environment = {
                        roomSize: { width: 0, height: 0, depth: 0 },
                        lighting: 'unknown',
                        surfaces: []
                    };
                    break;
                    
                case 'eye_tracking':
                    spatial.processors.eyeTracking = new EyeTrackingProcessor();
                    spatial.environmentalContext.gaze = {
                        direction: { x: 0, y: 0, z: 0 },
                        focus: null,
                        attention: 0.5
                    };
                    break;
            }
        });
        
        return spatial;
    }
    
    processSpatialData(spatialInput, element) {
        const spatialUpdates = {};
        
        // Process depth information
        if (spatialInput.depth) {
            const depthInfluence = this.calculateDepthInfluence(spatialInput.depth, element);
            spatialUpdates.u_scaleFactor = 0.8 + (depthInfluence * 0.4);
            spatialUpdates.u_surfaceOpacity = Math.max(0.1, 1.0 - depthInfluence);
        }
        
        // Process gaze direction
        if (spatialInput.gaze) {
            const gazeInfluence = this.calculateGazeInfluence(spatialInput.gaze, element);
            spatialUpdates.u_mouse_proximity = gazeInfluence.proximity;
            spatialUpdates.u_patternIntensity = 1.0 + (gazeInfluence.attention * 1.5);
        }
        
        // Process environmental context
        if (spatialInput.environment) {
            const envInfluence = this.calculateEnvironmentalInfluence(spatialInput.environment);
            spatialUpdates.u_environment_light = envInfluence.lighting;
            spatialUpdates.u_gridDensity = envInfluence.spatialDensity;
        }
        
        return spatialUpdates;
    }
    
    // =======================================================================
    // HAPTIC FEEDBACK ENGINE
    // =======================================================================
    
    generateHapticFeedback(visualResponse, device) {
        if (!device.hapticCapabilities || device.hapticCapabilities.length === 0) {
            return null;
        }
        
        const hapticPattern = {
            type: this.determineHapticType(visualResponse),
            intensity: this.mapVisualToHapticIntensity(visualResponse),
            duration: visualResponse.duration || 200,
            pattern: this.generateHapticPattern(visualResponse)
        };
        
        return this.hapticEngine.render(hapticPattern, device.hapticCapabilities);
    }
    
    determineHapticType(visualResponse) {
        const responseMapping = {
            'color_pulse': 'gentle_tap',
            'edge_highlight': 'sharp_tick',
            'geometry_morph': 'smooth_wave',
            'emergence_cascade': 'building_intensity',
            'dimensional_transition': 'complex_pattern'
        };
        
        return responseMapping[visualResponse.type] || 'gentle_tap';
    }
    
    // =======================================================================
    // NEURAL INTERFACE INTEGRATION
    // =======================================================================
    
    configureNeuralInterface() {
        if (this.currentDevice.type !== 'neural_interface') {
            return null;
        }
        
        return {
            enabled: true,
            capabilities: ['thought_detection', 'intention_mapping', 'emotional_response'],
            processors: {
                thought: new ThoughtPatternProcessor(),
                intention: new IntentionMappingProcessor(),
                emotion: new EmotionalResponseProcessor()
            },
            directControlMappings: {
                'focus_intention': 'u_mouse_proximity',
                'cognitive_load': 'u_dimension',
                'emotional_valence': 'u_colorShift',
                'attention_intensity': 'u_patternIntensity'
            }
        };
    }
    
    processNeuralInput(neuralData) {
        if (!this.neuralInterface.isConnected()) {
            return null;
        }
        
        const processed = this.neuralInterface.process(neuralData);
        const parameterUpdates = {};
        
        // Map neural patterns to visual parameters
        if (processed.intention) {
            parameterUpdates.u_mouse_proximity = processed.intention.focus;
            parameterUpdates.u_click_intensity = processed.intention.activation;
        }
        
        if (processed.cognition) {
            parameterUpdates.u_dimension = 3.0 + (processed.cognition.load * 2.0);
            parameterUpdates.u_morphFactor = processed.cognition.flexibility;
        }
        
        if (processed.emotion) {
            parameterUpdates.u_colorShift = processed.emotion.valence * Math.PI;
            parameterUpdates.u_patternIntensity = 0.5 + (processed.emotion.arousal * 2.0);
        }
        
        return {
            parameters: parameterUpdates,
            confidence: processed.confidence,
            latency: processed.latency,
            neuralState: processed.state
        };
    }
    
    // =======================================================================
    // PERFORMANCE OPTIMIZATION
    // =======================================================================
    
    optimizeForDevice(config, performanceProfile) {
        const optimized = { ...config };
        
        switch (performanceProfile) {
            case 'limited': // Smartwatch
                optimized.targetFPS = 30;
                optimized.maxElements = 3;
                optimized.parameterLimit = 10;
                optimized.geometryComplexity = 'minimal';
                break;
                
            case 'standard': // Web
                optimized.targetFPS = 60;
                optimized.maxElements = 10;
                optimized.parameterLimit = 25;
                optimized.geometryComplexity = 'moderate';
                break;
                
            case 'high': // AR Glasses
                optimized.targetFPS = 90;
                optimized.maxElements = 20;
                optimized.parameterLimit = 40;
                optimized.geometryComplexity = 'complex';
                break;
                
            case 'extreme': // Neural Interface
                optimized.targetFPS = 120;
                optimized.maxElements = 50;
                optimized.parameterLimit = 50;
                optimized.geometryComplexity = 'extreme';
                break;
        }
        
        return optimized;
    }
    
    // =======================================================================
    // DEVICE STATUS AND MONITORING
    // =======================================================================
    
    getDeviceStatus() {
        return {
            device: this.currentDevice,
            capabilities: this.capabilities,
            biometricActive: this.biometricProcessor.isActive(),
            spatialActive: this.spatialProcessor.isActive(),
            hapticAvailable: this.hapticEngine.isAvailable(),
            neuralConnected: this.neuralInterface.isConnected(),
            performanceMetrics: this.getPerformanceMetrics()
        };
    }
    
    getPerformanceMetrics() {
        return {
            currentFPS: this.measureCurrentFPS(),
            memoryUsage: this.estimateMemoryUsage(),
            batteryImpact: this.estimateBatteryImpact(),
            thermalState: this.getThermalState()
        };
    }
    
    // =======================================================================
    // UTILITY METHODS
    // =======================================================================
    
    calculateComplexity(config) {
        let complexity = 0;
        
        if (config.parameters) {
            complexity += Object.keys(config.parameters).length * 0.1;
        }
        
        if (config.interactions) {
            complexity += Object.keys(config.interactions).length * 0.2;
        }
        
        if (config.relationships) {
            complexity += 0.3;
        }
        
        const geometryComplexity = {
            'tetrahedron': 0.2,
            'sphere': 0.3,
            'hypercube': 0.5,
            'torus': 0.6,
            'klein': 0.7,
            'fractal': 0.8,
            'hopf_fibration': 0.9,
            'calabi_yau': 1.0
        };
        
        complexity += geometryComplexity[config.geometry] || 0.5;
        
        return Math.min(1.0, complexity);
    }
}

// ============================================================================
// 📱 DEVICE PROFILE DEFINITIONS
// ============================================================================

class WearableDeviceProfiles {
    constructor() {
        this.profiles = this.createDeviceProfiles();
    }
    
    createDeviceProfiles() {
        return {
            'smartwatch': {
                maxParameters: 12,
                preferredGeometries: ['sphere', 'torus', 'tetrahedron'],
                primaryInteraction: 'touch_pressure',
                biometricInputs: ['heart_rate', 'stress_level', 'activity_level'],
                hapticCapabilities: ['vibration', 'pressure'],
                screenConstraints: { maxWidth: 400, maxHeight: 400 },
                performanceProfile: 'limited',
                batteryOptimization: 'aggressive'
            },
            
            'ar_glasses': {
                maxParameters: 45,
                preferredGeometries: ['hyperbolic', 'penrose_tiling', 'hopf_fibration'],
                primaryInteraction: 'eye_tracking',
                spatialInputs: ['gaze_direction', 'head_orientation', 'environment_mapping'],
                biometricInputs: ['eye_fatigue', 'attention_level'],
                hapticCapabilities: ['audio_spatial', 'vibration_frames'],
                performanceProfile: 'high',
                spatialAwareness: true
            },
            
            'neural_interface': {
                maxParameters: 50,
                preferredGeometries: 'all',
                primaryInteraction: 'thought_pattern',
                neuralInputs: ['intention', 'attention', 'emotional_state', 'cognitive_load'],
                biometricInputs: ['brain_activity', 'neural_synchrony', 'mental_effort'],
                feedbackMethods: ['direct_neural', 'visual', 'haptic'],
                performanceProfile: 'extreme',
                latencyRequirement: '<10ms'
            },
            
            'web': {
                maxParameters: 35,
                preferredGeometries: ['hypercube', 'sphere', 'tetrahedron', 'wave'],
                primaryInteraction: 'mouse',
                inputs: ['mouse', 'keyboard', 'touch', 'scroll'],
                performanceProfile: 'standard',
                compatibility: 'universal'
            }
        };
    }
    
    get(deviceType) {
        return this.profiles[deviceType] || this.profiles['web'];
    }
    
    getCapabilities(device) {
        const profile = this.get(device.type);
        return {
            ...profile,
            detectedInputs: device.inputMethods,
            detectedSensors: device.sensors,
            actualScreenSize: device.screenSize
        };
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        VIB34DWearableAdapter,
        WearableDeviceProfiles
    };
}

// Export to window for browser use
if (typeof window !== 'undefined') {
    window.VIB34D_Wearable = {
        Adapter: VIB34DWearableAdapter,
        DeviceProfiles: WearableDeviceProfiles
    };
    
    console.log('📱 VIB34D Wearable Adapter loaded');
    console.log('🌐 Universal device support: Web → Wearable → Neural');
}