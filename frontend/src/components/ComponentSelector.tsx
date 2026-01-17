/**
 * Component Selector - Browse all 150+ components by category
 * Users can filter and select components based on their needs
 */

'use client';

import React, { useState, useMemo } from 'react';

// ============================================================================
// COMPONENT CATALOG - Complete inventory of all components
// ============================================================================

export interface ComponentInfo {
  name: string;
  category: string;
  description: string;
  tags: string[];
  props: string[];
  useCases: string[];
}

export const COMPONENT_CATALOG: ComponentInfo[] = [
  // ===== BUTTONS & ACTIONS =====
  {
    name: 'Button',
    category: 'Buttons & Actions',
    description: 'Universal button with all variants (primary, secondary, danger, success, ghost, link)',
    tags: ['button', 'action', 'click', 'primary', 'secondary'],
    props: ['variant', 'size', 'icon', 'loading', 'disabled', 'fullWidth'],
    useCases: ['Forms', 'Toolbars', 'Dialogs', 'Call-to-action']
  },
  {
    name: 'ButtonGroup',
    category: 'Buttons & Actions',
    description: 'Group related buttons together horizontally or vertically',
    tags: ['button', 'group', 'toolbar', 'actions'],
    props: ['orientation', 'children'],
    useCases: ['Toolbars', 'Filter groups', 'Action bars']
  },
  {
    name: 'IconButton',
    category: 'Buttons & Actions',
    description: 'Compact button with just an icon',
    tags: ['button', 'icon', 'compact', 'action'],
    props: ['icon', 'label', 'variant', 'size'],
    useCases: ['Toolbars', 'Compact UIs', 'Mobile apps']
  },
  {
    name: 'FloatingActionButton',
    category: 'Buttons & Actions',
    description: 'Floating action button for primary actions (FAB)',
    tags: ['fab', 'floating', 'mobile', 'primary action'],
    props: ['icon', 'position', 'actions'],
    useCases: ['Mobile apps', 'Quick actions', 'Primary CTA']
  },

  // ===== NAVIGATION =====
  {
    name: 'Navbar',
    category: 'Navigation',
    description: 'Top navigation bar with logo, menu items, and mobile support',
    tags: ['nav', 'navigation', 'menu', 'header'],
    props: ['logo', 'items', 'rightItems', 'sticky'],
    useCases: ['App header', 'Site navigation', 'Mobile menu']
  },
  {
    name: 'Sidebar',
    category: 'Navigation',
    description: 'Side navigation with collapsible sections',
    tags: ['sidebar', 'navigation', 'menu', 'drawer'],
    props: ['items', 'collapsed', 'position'],
    useCases: ['Admin panels', 'Dashboards', 'App navigation']
  },
  {
    name: 'Breadcrumbs',
    category: 'Navigation',
    description: 'Hierarchical navigation trail',
    tags: ['breadcrumbs', 'navigation', 'hierarchy'],
    props: ['items', 'separator'],
    useCases: ['Deep navigation', 'File paths', 'Multi-level menus']
  },
  {
    name: 'Tabs',
    category: 'Navigation',
    description: 'Tabbed interface for switching content',
    tags: ['tabs', 'navigation', 'panels', 'switching'],
    props: ['tabs', 'variant', 'defaultTab'],
    useCases: ['Settings', 'Profiles', 'Multi-section content']
  },
  {
    name: 'Pagination',
    category: 'Navigation',
    description: 'Navigate through paged data',
    tags: ['pagination', 'paging', 'navigation'],
    props: ['currentPage', 'totalPages', 'onPageChange'],
    useCases: ['Data tables', 'Search results', 'Lists']
  },

  // ===== MODALS & OVERLAYS =====
  {
    name: 'Modal',
    category: 'Modals & Overlays',
    description: 'Full-featured modal dialog with backdrop',
    tags: ['modal', 'dialog', 'overlay', 'popup'],
    props: ['isOpen', 'title', 'size', 'footer', 'closeOnOverlayClick'],
    useCases: ['Forms', 'Confirmations', 'Details', 'Wizards']
  },
  {
    name: 'Drawer',
    category: 'Modals & Overlays',
    description: 'Side panel that slides in from edges',
    tags: ['drawer', 'panel', 'sidebar', 'overlay'],
    props: ['isOpen', 'position', 'size', 'title'],
    useCases: ['Filters', 'Settings', 'Details', 'Navigation']
  },
  {
    name: 'Popover',
    category: 'Modals & Overlays',
    description: 'Small overlay anchored to an element',
    tags: ['popover', 'popup', 'tooltip', 'overlay'],
    props: ['trigger', 'content', 'position'],
    useCases: ['Additional info', 'Menus', 'Quick actions']
  },
  {
    name: 'Tooltip',
    category: 'Modals & Overlays',
    description: 'Small text hint on hover',
    tags: ['tooltip', 'hint', 'help', 'info'],
    props: ['content', 'position', 'delay'],
    useCases: ['Help text', 'Icon labels', 'Abbreviations']
  },
  {
    name: 'ConfirmDialog',
    category: 'Modals & Overlays',
    description: 'Confirmation dialog for destructive actions',
    tags: ['confirm', 'dialog', 'warning', 'delete'],
    props: ['message', 'confirmText', 'variant', 'onConfirm'],
    useCases: ['Delete confirmation', 'Irreversible actions', 'Warnings']
  },
  {
    name: 'BottomSheet',
    category: 'Modals & Overlays',
    description: 'Mobile bottom sheet with snap points',
    tags: ['bottom sheet', 'mobile', 'overlay', 'drawer'],
    props: ['isOpen', 'snapPoints'],
    useCases: ['Mobile menus', 'Mobile filters', 'Mobile forms']
  },

  // ===== DATA DISPLAY =====
  {
    name: 'DataTable',
    category: 'Data Display',
    description: 'Feature-rich table with sorting, filtering, pagination',
    tags: ['table', 'data', 'grid', 'list'],
    props: ['data', 'columns', 'selectable', 'pagination', 'rowActions'],
    useCases: ['Admin panels', 'Reports', 'Data management']
  },
  {
    name: 'List',
    category: 'Data Display',
    description: 'Flexible list with drag-drop, infinite scroll, swipe actions',
    tags: ['list', 'items', 'scroll', 'drag'],
    props: ['items', 'infiniteScroll', 'expandable', 'swipeActions'],
    useCases: ['News feeds', 'Todo lists', 'Contact lists']
  },
  {
    name: 'CardGrid',
    category: 'Data Display',
    description: 'Responsive grid of cards',
    tags: ['cards', 'grid', 'responsive', 'gallery'],
    props: ['items', 'columns', 'gap', 'onCardClick'],
    useCases: ['Product catalogs', 'Galleries', 'Dashboards']
  },
  {
    name: 'DetailView',
    category: 'Data Display',
    description: 'Display entity details in sections',
    tags: ['details', 'view', 'profile', 'entity'],
    props: ['title', 'sections', 'actions'],
    useCases: ['Profile pages', 'Product details', 'Entity views']
  },
  {
    name: 'Timeline',
    category: 'Data Display',
    description: 'Chronological timeline of events',
    tags: ['timeline', 'events', 'history', 'chronological'],
    props: ['events', 'orientation'],
    useCases: ['Activity logs', 'History', 'Order tracking']
  },

  // ===== FORMS & INPUTS =====
  {
    name: 'UniversalForm',
    category: 'Forms & Inputs',
    description: 'Complete form with all input types and validation',
    tags: ['form', 'input', 'validation', 'submit'],
    props: ['fields', 'onSubmit', 'validationRules', 'layout'],
    useCases: ['Data entry', 'Settings', 'User registration']
  },
  {
    name: 'RichTextEditor',
    category: 'Forms & Inputs',
    description: 'WYSIWYG text editor with formatting',
    tags: ['editor', 'rich text', 'wysiwyg', 'formatting'],
    props: ['value', 'onChange', 'toolbar'],
    useCases: ['Blog posts', 'Comments', 'Documents']
  },
  {
    name: 'FileUpload',
    category: 'Forms & Inputs',
    description: 'File upload with drag-drop and preview',
    tags: ['upload', 'file', 'drag drop', 'image'],
    props: ['accept', 'multiple', 'maxSize', 'onUpload'],
    useCases: ['Image upload', 'Document upload', 'Avatar upload']
  },
  {
    name: 'ColorPicker',
    category: 'Forms & Inputs',
    description: 'Color selection with presets',
    tags: ['color', 'picker', 'palette', 'design'],
    props: ['value', 'onChange', 'presets'],
    useCases: ['Theme editors', 'Design tools', 'Customization']
  },
  {
    name: 'DropZone',
    category: 'Forms & Inputs',
    description: 'Large drop zone for file uploads',
    tags: ['drop zone', 'upload', 'drag drop', 'files'],
    props: ['onDrop', 'acceptedTypes', 'multiple', 'maxSize'],
    useCases: ['Bulk uploads', 'File managers', 'Import data']
  },

  // ===== FEEDBACK & NOTIFICATIONS =====
  {
    name: 'Toast',
    category: 'Feedback',
    description: 'Temporary notification message',
    tags: ['toast', 'notification', 'alert', 'message'],
    props: ['message', 'type', 'duration', 'position'],
    useCases: ['Success messages', 'Errors', 'Info alerts']
  },
  {
    name: 'Alert',
    category: 'Feedback',
    description: 'Prominent alert message',
    tags: ['alert', 'warning', 'info', 'error'],
    props: ['message', 'type', 'dismissible', 'action'],
    useCases: ['Warnings', 'Errors', 'Info banners']
  },
  {
    name: 'Badge',
    category: 'Feedback',
    description: 'Small status indicator',
    tags: ['badge', 'status', 'label', 'count'],
    props: ['content', 'variant', 'size'],
    useCases: ['Status', 'Counts', 'Labels', 'Notifications']
  },
  {
    name: 'Spinner',
    category: 'Feedback',
    description: 'Loading spinner indicator',
    tags: ['spinner', 'loading', 'progress'],
    props: ['size', 'color'],
    useCases: ['Loading states', 'Processing', 'Async operations']
  },
  {
    name: 'ProgressBar',
    category: 'Feedback',
    description: 'Linear progress indicator',
    tags: ['progress', 'bar', 'loading', 'completion'],
    props: ['value', 'max', 'showLabel', 'variant'],
    useCases: ['File uploads', 'Task completion', 'Loading']
  },
  {
    name: 'Skeleton',
    category: 'Feedback',
    description: 'Loading placeholder skeleton',
    tags: ['skeleton', 'loading', 'placeholder'],
    props: ['variant', 'count', 'width', 'height'],
    useCases: ['Loading content', 'Lazy loading', 'Placeholders']
  },
  {
    name: 'EmptyState',
    category: 'Feedback',
    description: 'Empty state placeholder',
    tags: ['empty', 'placeholder', 'no data'],
    props: ['icon', 'title', 'description', 'action'],
    useCases: ['No results', 'Empty lists', 'First-time use']
  },

  // ===== CHARTS & VISUALIZATION =====
  {
    name: 'LineChart',
    category: 'Charts & Visualization',
    description: 'Line chart for trends over time',
    tags: ['chart', 'line', 'graph', 'trend'],
    props: ['data', 'xAxis', 'yAxis', 'series'],
    useCases: ['Trends', 'Time series', 'Analytics']
  },
  {
    name: 'BarChart',
    category: 'Charts & Visualization',
    description: 'Bar chart for comparisons',
    tags: ['chart', 'bar', 'graph', 'comparison'],
    props: ['data', 'categories', 'series', 'horizontal'],
    useCases: ['Comparisons', 'Rankings', 'Categories']
  },
  {
    name: 'PieChart',
    category: 'Charts & Visualization',
    description: 'Pie/donut chart for proportions',
    tags: ['chart', 'pie', 'donut', 'percentage'],
    props: ['data', 'donut', 'showLegend'],
    useCases: ['Proportions', 'Percentages', 'Parts of whole']
  },
  {
    name: 'MetricCard',
    category: 'Charts & Visualization',
    description: 'Key metric display with trend',
    tags: ['metric', 'kpi', 'stat', 'number'],
    props: ['title', 'value', 'change', 'icon'],
    useCases: ['KPIs', 'Dashboards', 'Statistics']
  },
  {
    name: 'Heatmap',
    category: 'Charts & Visualization',
    description: 'Color-coded data grid',
    tags: ['heatmap', 'grid', 'matrix', 'density'],
    props: ['data', 'colorScale'],
    useCases: ['Patterns', 'Density', 'Correlations']
  },
  {
    name: 'GaugeChart',
    category: 'Charts & Visualization',
    description: 'Circular gauge indicator',
    tags: ['gauge', 'meter', 'progress', 'circular'],
    props: ['value', 'min', 'max', 'thresholds'],
    useCases: ['Performance', 'Progress', 'Metrics']
  },
  {
    name: 'FunnelChart',
    category: 'Charts & Visualization',
    description: 'Conversion funnel visualization',
    tags: ['funnel', 'conversion', 'flow'],
    props: ['stages', 'data'],
    useCases: ['Sales funnels', 'Conversion tracking', 'Pipelines']
  },
  {
    name: 'NetworkGraph',
    category: 'Charts & Visualization',
    description: 'Node-edge relationship graph',
    tags: ['network', 'graph', 'nodes', 'relationships'],
    props: ['nodes', 'edges'],
    useCases: ['Relationships', 'Networks', 'Dependencies']
  },
  {
    name: 'PivotTable',
    category: 'Charts & Visualization',
    description: 'Dynamic data pivoting and aggregation',
    tags: ['pivot', 'table', 'aggregation', 'analysis'],
    props: ['data', 'rows', 'columns', 'values', 'aggregation'],
    useCases: ['Data analysis', 'Business intelligence', 'Reporting']
  },
  {
    name: 'Treemap',
    category: 'Charts & Visualization',
    description: 'Hierarchical data as nested rectangles',
    tags: ['treemap', 'hierarchy', 'nested', 'proportions'],
    props: ['data', 'valueKey'],
    useCases: ['Hierarchies', 'File sizes', 'Market share']
  },

  // ===== ANIMATION & MOTION =====
  {
    name: 'Transition',
    category: 'Animation',
    description: 'CSS/JS transitions with timing control',
    tags: ['animation', 'transition', 'fade', 'slide'],
    props: ['show', 'type', 'duration', 'easing'],
    useCases: ['Page transitions', 'Element reveals', 'State changes']
  },
  {
    name: 'SpringAnimation',
    category: 'Animation',
    description: 'Physics-based spring animations',
    tags: ['animation', 'spring', 'physics', 'natural'],
    props: ['value', 'stiffness', 'damping', 'mass'],
    useCases: ['Smooth interactions', 'Natural motion', 'UI feedback']
  },
  {
    name: 'ParallaxScroll',
    category: 'Animation',
    description: 'Parallax scrolling effects',
    tags: ['parallax', 'scroll', 'animation', 'depth'],
    props: ['speed', 'direction'],
    useCases: ['Landing pages', 'Storytelling', 'Depth effects']
  },
  {
    name: 'RevealOnScroll',
    category: 'Animation',
    description: 'Reveal elements as they enter viewport',
    tags: ['reveal', 'scroll', 'animation', 'intersection'],
    props: ['animation', 'threshold', 'delay'],
    useCases: ['Marketing sites', 'Portfolios', 'Content reveal']
  },
  {
    name: 'GestureHandler',
    category: 'Animation',
    description: 'Touch/mouse gesture detection',
    tags: ['gesture', 'touch', 'swipe', 'pinch', 'rotate'],
    props: ['onSwipe', 'onPinch', 'onRotate', 'threshold'],
    useCases: ['Mobile apps', 'Galleries', 'Interactive content']
  },
  {
    name: 'Morphing',
    category: 'Animation',
    description: 'Shape morphing animations',
    tags: ['morph', 'shape', 'animation', 'svg'],
    props: ['from', 'to', 'duration', 'trigger'],
    useCases: ['Icon transitions', 'Shape changes', 'Visual effects']
  },
  {
    name: 'Keyframe',
    category: 'Animation',
    description: 'Custom keyframe animations',
    tags: ['keyframe', 'animation', 'custom', 'complex'],
    props: ['keyframes', 'duration', 'iterations'],
    useCases: ['Complex animations', 'Custom effects', 'Sequences']
  },

  // ===== 3D & WEBGL =====
  {
    name: 'Scene3D',
    category: '3D & WebGL',
    description: '3D scene with camera and lighting',
    tags: ['3d', 'webgl', 'scene', 'three.js'],
    props: ['backgroundColor', 'cameraPosition', 'enableControls'],
    useCases: ['3D apps', 'Product viewers', 'Games']
  },
  {
    name: 'Model3D',
    category: '3D & WebGL',
    description: 'Load and display 3D models',
    tags: ['3d', 'model', 'gltf', 'obj'],
    props: ['modelUrl', 'position', 'rotation', 'scale'],
    useCases: ['Product 3D', 'Architecture', 'Prototyping']
  },
  {
    name: 'Camera3D',
    category: '3D & WebGL',
    description: '3D camera with controls',
    tags: ['3d', 'camera', 'perspective', 'view'],
    props: ['type', 'fov', 'position', 'lookAt'],
    useCases: ['3D navigation', 'Games', 'Simulations']
  },
  {
    name: 'Light3D',
    category: '3D & WebGL',
    description: '3D lighting (ambient, directional, point, spot)',
    tags: ['3d', 'light', 'lighting', 'shadow'],
    props: ['type', 'color', 'intensity', 'castShadow'],
    useCases: ['Realistic rendering', '3D scenes', 'Product lighting']
  },
  {
    name: 'Geometry3D',
    category: '3D & WebGL',
    description: 'Basic 3D shapes (box, sphere, cylinder)',
    tags: ['3d', 'geometry', 'shape', 'primitive'],
    props: ['type', 'size', 'color', 'wireframe'],
    useCases: ['Prototyping', 'Games', 'Placeholders']
  },
  {
    name: 'Particle3D',
    category: '3D & WebGL',
    description: '3D particle systems',
    tags: ['3d', 'particles', 'effects', 'emitter'],
    props: ['count', 'velocity', 'lifetime', 'emitting'],
    useCases: ['Effects', 'Weather', 'Magic spells']
  },
  {
    name: 'Skybox3D',
    category: '3D & WebGL',
    description: '360° environment background',
    tags: ['3d', 'skybox', 'environment', '360'],
    props: ['images', 'color', 'type'],
    useCases: ['Immersive scenes', 'VR', 'Backgrounds']
  },

  // ===== GAME COMPONENTS =====
  {
    name: 'GameCanvas',
    category: 'Game Development',
    description: 'Main canvas for 2D games with game loop',
    tags: ['game', 'canvas', '2d', 'loop'],
    props: ['width', 'height', 'backgroundColor', 'fps', 'onUpdate', 'onRender'],
    useCases: ['2D games', 'Game prototypes', 'Interactive apps']
  },
  {
    name: 'Sprite',
    category: 'Game Development',
    description: '2D sprite with animation frames',
    tags: ['game', 'sprite', 'animation', '2d'],
    props: ['x', 'y', 'image', 'frames', 'rotation'],
    useCases: ['Characters', 'Objects', 'Enemies']
  },
  {
    name: 'PhysicsBody',
    category: 'Game Development',
    description: '2D physics with velocity, gravity, collision',
    tags: ['game', 'physics', 'velocity', 'gravity'],
    props: ['velocityX', 'velocityY', 'gravity', 'friction', 'mass'],
    useCases: ['Platformers', 'Physics games', 'Simulations']
  },
  {
    name: 'GameController',
    category: 'Game Development',
    description: 'Input handling (keyboard, mouse, touch, gamepad)',
    tags: ['game', 'input', 'controller', 'keyboard'],
    props: ['onKeyDown', 'onKeyUp', 'onMouseClick', 'onGamepadInput'],
    useCases: ['All games', 'Interactive apps', 'Input handling']
  },
  {
    name: 'Tilemap',
    category: 'Game Development',
    description: 'Grid-based tile system for levels',
    tags: ['game', 'tilemap', 'grid', 'level'],
    props: ['tiles', 'tileWidth', 'tileHeight', 'tilesetImage'],
    useCases: ['Level design', 'Maps', 'Grid games']
  },
  {
    name: 'CollisionDetector',
    category: 'Game Development',
    description: 'Detect collisions between game objects',
    tags: ['game', 'collision', 'detection', 'physics'],
    props: ['objects', 'onCollision'],
    useCases: ['Games', 'Physics', 'Interaction']
  },
  {
    name: 'ParticleEmitter',
    category: 'Game Development',
    description: 'Game particle effects (explosions, trails)',
    tags: ['game', 'particles', 'effects', 'emitter'],
    props: ['rate', 'lifetime', 'angle', 'speed', 'gravity'],
    useCases: ['Explosions', 'Trails', 'Effects']
  },
  {
    name: 'ScoreTracker',
    category: 'Game Development',
    description: 'Game score and stats display',
    tags: ['game', 'score', 'stats', 'ui'],
    props: ['score', 'highScore', 'lives', 'level', 'time'],
    useCases: ['All games', 'Leaderboards', 'Game UI']
  },

  // ===== ADVANCED LAYOUT =====
  {
    name: 'MasonryGrid',
    category: 'Layout',
    description: 'Pinterest-style masonry layout',
    tags: ['layout', 'masonry', 'grid', 'pinterest'],
    props: ['items', 'columns', 'gap'],
    useCases: ['Image galleries', 'Pinterest-like', 'Card layouts']
  },
  {
    name: 'ResponsiveGrid',
    category: 'Layout',
    description: 'Auto-responsive grid with breakpoints',
    tags: ['layout', 'grid', 'responsive', 'auto'],
    props: ['minColumnWidth', 'gap', 'autoFit'],
    useCases: ['Product grids', 'Responsive layouts', 'Card grids']
  },
  {
    name: 'StickyContainer',
    category: 'Layout',
    description: 'Sticky positioning with scroll effects',
    tags: ['layout', 'sticky', 'scroll', 'fixed'],
    props: ['top', 'zIndex', 'onStick'],
    useCases: ['Headers', 'Sidebars', 'Navigation']
  },
  {
    name: 'ParticleBackground',
    category: 'Layout',
    description: 'Animated particle background',
    tags: ['background', 'particles', 'animation', 'effect'],
    props: ['count', 'color', 'speed', 'showConnections'],
    useCases: ['Landing pages', 'Hero sections', 'Creative sites']
  },
  {
    name: 'BlurEffect',
    category: 'Layout',
    description: 'Backdrop blur (glassmorphism)',
    tags: ['effect', 'blur', 'glassmorphism', 'backdrop'],
    props: ['blur', 'brightness', 'saturation', 'opacity'],
    useCases: ['Modern UI', 'Overlays', 'Cards']
  },
  {
    name: 'GradientBackground',
    category: 'Layout',
    description: 'Animated gradient backgrounds',
    tags: ['background', 'gradient', 'animation', 'color'],
    props: ['colors', 'angle', 'animate', 'speed'],
    useCases: ['Hero sections', 'Cards', 'Creative backgrounds']
  },
  {
    name: 'ShaderEffect',
    category: 'Layout',
    description: 'CSS shader effects (wave, glow, distortion)',
    tags: ['effect', 'shader', 'filter', 'visual'],
    props: ['type', 'intensity', 'color'],
    useCases: ['Visual effects', 'Creative apps', 'Emphasis']
  },
  {
    name: 'InfiniteScroll',
    category: 'Layout',
    description: 'Infinite scrolling with virtual rendering',
    tags: ['scroll', 'infinite', 'lazy load', 'virtual'],
    props: ['items', 'hasMore', 'onLoadMore', 'threshold'],
    useCases: ['Feeds', 'Lists', 'Social media']
  },
  {
    name: 'FlexLayout',
    category: 'Layout',
    description: 'Advanced flexbox layouts with presets',
    tags: ['layout', 'flex', 'flexbox', 'responsive'],
    props: ['direction', 'justify', 'align', 'wrap', 'gap'],
    useCases: ['Any layout', 'Responsive design', 'Alignment']
  },

  // ===== AUTHENTICATION =====
  {
    name: 'LoginForm',
    category: 'Authentication',
    description: 'Complete login with validation & social auth',
    tags: ['auth', 'login', 'form', 'social'],
    props: ['onSubmit', 'allowSocialAuth', 'showForgotPassword'],
    useCases: ['User login', 'Authentication', 'Sign in']
  },
  {
    name: 'TwoFactorAuth',
    category: 'Authentication',
    description: '2FA verification with code input',
    tags: ['auth', '2fa', 'security', 'verification'],
    props: ['codeLength', 'onVerify', 'onResend'],
    useCases: ['Security', 'Two-factor auth', 'Verification']
  },

  // ===== PAYMENT =====
  {
    name: 'CreditCardInput',
    category: 'Payment',
    description: 'Credit card with validation & preview',
    tags: ['payment', 'credit card', 'checkout', 'billing'],
    props: ['onValidate'],
    useCases: ['Checkout', 'Payment forms', 'Billing']
  },
  {
    name: 'CheckoutFlow',
    category: 'Payment',
    description: 'Multi-step checkout process',
    tags: ['payment', 'checkout', 'wizard', 'cart'],
    props: ['steps', 'total', 'onComplete'],
    useCases: ['E-commerce', 'Shopping cart', 'Orders']
  },

  // ===== MAPS & LOCATION =====
  {
    name: 'InteractiveMap',
    category: 'Maps',
    description: 'Maps with markers and interactions',
    tags: ['map', 'location', 'markers', 'geo'],
    props: ['center', 'zoom', 'markers', 'onMarkerClick'],
    useCases: ['Store locators', 'Delivery', 'Real estate']
  },

  // ===== DRAG & DROP =====
  {
    name: 'DragDropList',
    category: 'Drag & Drop',
    description: 'Sortable drag & drop lists',
    tags: ['drag', 'drop', 'sortable', 'reorder'],
    props: ['items', 'onReorder'],
    useCases: ['Todo lists', 'Kanban', 'Playlists']
  },

  // ===== CODE & DATA =====
  {
    name: 'CodeEditor',
    category: 'Code Editors',
    description: 'Syntax highlighting code editor',
    tags: ['code', 'editor', 'syntax', 'programming'],
    props: ['value', 'language', 'theme', 'lineNumbers'],
    useCases: ['Code playgrounds', 'IDEs', 'Documentation']
  },
  {
    name: 'DiffViewer',
    category: 'Code Editors',
    description: 'Side-by-side diff viewer',
    tags: ['diff', 'compare', 'version', 'code'],
    props: ['original', 'modified', 'language'],
    useCases: ['Code review', 'Version control', 'Comparisons']
  },
  {
    name: 'JSONViewer',
    category: 'Code Editors',
    description: 'Interactive JSON tree viewer',
    tags: ['json', 'viewer', 'tree', 'data'],
    props: ['data', 'expanded'],
    useCases: ['API tools', 'Data inspection', 'Debugging']
  },
  {
    name: 'VirtualTable',
    category: 'Advanced Tables',
    description: 'Virtual scrolling for massive datasets',
    tags: ['table', 'virtual', 'performance', 'big data'],
    props: ['data', 'columns', 'rowHeight', 'height'],
    useCases: ['Large datasets', 'Performance', 'Big tables']
  },
  {
    name: 'EditableTable',
    category: 'Advanced Tables',
    description: 'Inline cell editing with export',
    tags: ['table', 'editable', 'inline', 'spreadsheet'],
    props: ['data', 'columns', 'onCellEdit', 'onExport'],
    useCases: ['Data entry', 'Spreadsheets', 'Admin panels']
  },
  {
    name: 'PivotTableAdvanced',
    category: 'Advanced Tables',
    description: 'Advanced pivot with drill-down',
    tags: ['pivot', 'table', 'analysis', 'business intelligence'],
    props: ['data', 'rows', 'columns', 'values', 'aggregation'],
    useCases: ['BI tools', 'Analytics', 'Data analysis']
  },

  // ===== WORKFLOW =====
  {
    name: 'Wizard',
    category: 'Workflow',
    description: 'Multi-step wizard with navigation',
    tags: ['wizard', 'stepper', 'multi-step', 'form'],
    props: ['steps', 'currentStep', 'onStepChange'],
    useCases: ['Onboarding', 'Setup wizards', 'Multi-step forms']
  },
  {
    name: 'KanbanBoard',
    category: 'Workflow',
    description: 'Drag-drop kanban board',
    tags: ['kanban', 'board', 'workflow', 'tasks'],
    props: ['columns', 'items', 'onItemMove'],
    useCases: ['Project management', 'Task tracking', 'Workflows']
  },
  {
    name: 'ProgressTracker',
    category: 'Workflow',
    description: 'Visual progress indicator',
    tags: ['progress', 'tracker', 'steps', 'status'],
    props: ['steps', 'currentStep'],
    useCases: ['Order tracking', 'Progress', 'Workflows']
  },

  // ===== SCHEDULING =====
  {
    name: 'MonthCalendar',
    category: 'Scheduling',
    description: 'Monthly calendar view',
    tags: ['calendar', 'month', 'date', 'schedule'],
    props: ['events', 'selectedDate', 'onDateSelect'],
    useCases: ['Scheduling', 'Bookings', 'Event management']
  },
  {
    name: 'TimeSlotPicker',
    category: 'Scheduling',
    description: 'Time slot selection interface',
    tags: ['time', 'slot', 'booking', 'schedule'],
    props: ['slots', 'selectedSlot', 'onSlotSelect'],
    useCases: ['Appointments', 'Bookings', 'Scheduling']
  },
  {
    name: 'DateRangePicker',
    category: 'Scheduling',
    description: 'Select date ranges',
    tags: ['date', 'range', 'picker', 'calendar'],
    props: ['startDate', 'endDate', 'onRangeSelect'],
    useCases: ['Booking systems', 'Reports', 'Filters']
  },

  // ===== ORGANIZATION =====
  {
    name: 'Accordion',
    category: 'Organization',
    description: 'Collapsible content sections',
    tags: ['accordion', 'collapse', 'expand', 'sections'],
    props: ['items', 'allowMultiple', 'defaultOpen'],
    useCases: ['FAQs', 'Content organization', 'Space saving']
  },
  {
    name: 'TreeView',
    category: 'Organization',
    description: 'Hierarchical tree navigation',
    tags: ['tree', 'hierarchy', 'navigation', 'nested'],
    props: ['nodes', 'onNodeClick', 'expandedNodes'],
    useCases: ['File browsers', 'Navigation', 'Hierarchies']
  },
  {
    name: 'SplitPane',
    category: 'Organization',
    description: 'Resizable split panes',
    tags: ['split', 'pane', 'resize', 'layout'],
    props: ['split', 'defaultSize', 'minSize'],
    useCases: ['Editors', 'Viewers', 'Dual panes']
  },

  // ===== SEARCH =====
  {
    name: 'SearchBar',
    category: 'Search',
    description: 'Search input with suggestions',
    tags: ['search', 'input', 'autocomplete', 'find'],
    props: ['value', 'onSearch', 'suggestions', 'placeholder'],
    useCases: ['Site search', 'Filters', 'Find content']
  },
  {
    name: 'FilterPanel',
    category: 'Search',
    description: 'Multi-faceted filter interface',
    tags: ['filter', 'facets', 'search', 'refine'],
    props: ['filters', 'onFilterChange'],
    useCases: ['E-commerce', 'Search refinement', 'Data filtering']
  },
  {
    name: 'Autocomplete',
    category: 'Search',
    description: 'Input with auto-completion',
    tags: ['autocomplete', 'suggest', 'input', 'typeahead'],
    props: ['suggestions', 'onSelect', 'async'],
    useCases: ['Search', 'Address input', 'Tag input']
  },
  {
    name: 'FacetedSearch',
    category: 'Search',
    description: 'Advanced faceted search',
    tags: ['search', 'faceted', 'filters', 'advanced'],
    props: ['facets', 'onSearch', 'results'],
    useCases: ['E-commerce', 'Advanced search', 'Product discovery']
  },

  // ===== MOBILE =====
  {
    name: 'PullToRefresh',
    category: 'Mobile',
    description: 'Pull-to-refresh gesture',
    tags: ['mobile', 'refresh', 'pull', 'gesture'],
    props: ['onRefresh'],
    useCases: ['Mobile feeds', 'Lists', 'Data refresh']
  },
  {
    name: 'SwipeActions',
    category: 'Mobile',
    description: 'Swipe left/right for actions',
    tags: ['mobile', 'swipe', 'actions', 'gesture'],
    props: ['leftActions', 'rightActions'],
    useCases: ['Mobile lists', 'Email apps', 'Quick actions']
  },

  // ===== COLLABORATION =====
  {
    name: 'UserPresence',
    category: 'Collaboration',
    description: 'Show online users with avatars',
    tags: ['collaboration', 'presence', 'users', 'online'],
    props: ['users', 'maxVisible'],
    useCases: ['Collaborative apps', 'Chat', 'Team tools']
  },
  {
    name: 'Comments',
    category: 'Collaboration',
    description: 'Threaded comments system',
    tags: ['comments', 'discussion', 'threaded', 'social'],
    props: ['comments', 'onAddComment', 'nested'],
    useCases: ['Blogs', 'Social', 'Feedback']
  },
  {
    name: 'ShareButton',
    category: 'Collaboration',
    description: 'Social sharing with permissions',
    tags: ['share', 'social', 'permissions', 'collaboration'],
    props: ['url', 'platforms', 'permissions'],
    useCases: ['Social sharing', 'Content distribution', 'Invites']
  },
  {
    name: 'LiveCursor',
    category: 'Collaboration',
    description: 'Real-time cursor positions',
    tags: ['collaboration', 'cursor', 'real-time', 'multiplayer'],
    props: ['users', 'onCursorMove'],
    useCases: ['Collaborative editors', 'Whiteboards', 'Design tools']
  },

  // ===== CONFIGURATION =====
  {
    name: 'SettingsPanel',
    category: 'Configuration',
    description: 'Complete settings interface',
    tags: ['settings', 'preferences', 'configuration'],
    props: ['sections', 'onSave'],
    useCases: ['App settings', 'User preferences', 'Configuration']
  },
  {
    name: 'PreferencesEditor',
    category: 'Configuration',
    description: 'User preferences editing',
    tags: ['preferences', 'settings', 'user', 'edit'],
    props: ['preferences', 'onChange'],
    useCases: ['User settings', 'Customization', 'Preferences']
  },
  {
    name: 'PermissionsManager',
    category: 'Configuration',
    description: 'Role and permission management',
    tags: ['permissions', 'roles', 'access', 'security'],
    props: ['roles', 'permissions', 'onUpdate'],
    useCases: ['Access control', 'Admin panels', 'Security']
  },
  {
    name: 'ThemeCustomizer',
    category: 'Configuration',
    description: 'Theme and appearance customization',
    tags: ['theme', 'customization', 'appearance', 'colors'],
    props: ['theme', 'onThemeChange'],
    useCases: ['Branding', 'Customization', 'White-label']
  },

  // ===== MEDIA =====
  {
    name: 'VideoPlayer',
    category: 'Media',
    description: 'Full-featured video player',
    tags: ['video', 'player', 'media', 'streaming'],
    props: ['src', 'controls', 'autoplay', 'onPlay', 'onPause'],
    useCases: ['Video content', 'Courses', 'Entertainment']
  },
  {
    name: 'AudioPlayer',
    category: 'Media',
    description: 'Audio player with waveform',
    tags: ['audio', 'player', 'music', 'podcast'],
    props: ['src', 'playlist', 'showWaveform'],
    useCases: ['Music', 'Podcasts', 'Audio content']
  },
  {
    name: 'ImageGallery',
    category: 'Media',
    description: 'Image gallery with lightbox',
    tags: ['gallery', 'images', 'lightbox', 'photos'],
    props: ['images', 'columns', 'onImageClick'],
    useCases: ['Portfolios', 'Products', 'Photography']
  },
  {
    name: 'ImageEditor',
    category: 'Media',
    description: 'Basic image editing (filters, crop, rotate)',
    tags: ['image', 'editor', 'filters', 'edit'],
    props: ['src', 'onSave', 'tools'],
    useCases: ['Photo editing', 'Avatar upload', 'Content creation']
  },
  {
    name: 'DrawingCanvas',
    category: 'Media',
    description: 'Freehand drawing canvas',
    tags: ['drawing', 'canvas', 'sketch', 'paint'],
    props: ['width', 'height', 'tools', 'onSave'],
    useCases: ['Signatures', 'Annotations', 'Whiteboard']
  },

  // ===== COMMUNICATION =====
  {
    name: 'ChatInterface',
    category: 'Communication',
    description: 'Real-time chat with reactions',
    tags: ['chat', 'messaging', 'real-time', 'communication'],
    props: ['messages', 'onSendMessage', 'currentUser'],
    useCases: ['Chat apps', 'Customer support', 'Team communication']
  },
  {
    name: 'LiveFeed',
    category: 'Communication',
    description: 'Social media style live feed',
    tags: ['feed', 'social', 'posts', 'timeline'],
    props: ['items', 'onLike', 'onComment', 'onLoadMore'],
    useCases: ['Social media', 'Activity feeds', 'News feeds']
  },
  {
    name: 'NotificationCenter',
    category: 'Communication',
    description: 'Notification management center',
    tags: ['notifications', 'alerts', 'center', 'inbox'],
    props: ['notifications', 'onMarkRead', 'onClearAll'],
    useCases: ['Notifications', 'Alerts', 'Activity center']
  },
  {
    name: 'VideoCallInterface',
    category: 'Communication',
    description: 'Multi-party video call UI',
    tags: ['video', 'call', 'conference', 'webrtc'],
    props: ['participants', 'localStream', 'onMute', 'onVideo'],
    useCases: ['Video calls', 'Meetings', 'Telemedicine']
  },
  {
    name: 'ActivityFeed',
    category: 'Communication',
    description: 'Real-time activity stream',
    tags: ['activity', 'feed', 'stream', 'timeline'],
    props: ['activities', 'onActivityClick'],
    useCases: ['Activity logs', 'Audit trails', 'Team updates']
  },

  // ===== INDUSTRY-SPECIFIC =====
  {
    name: 'AppointmentScheduler',
    category: 'Industry-Specific',
    description: 'Healthcare appointment booking',
    tags: ['healthcare', 'appointment', 'booking', 'schedule'],
    props: ['doctors', 'slots', 'onBook'],
    useCases: ['Healthcare', 'Medical appointments', 'Doctor booking']
  },
  {
    name: 'StockTicker',
    category: 'Industry-Specific',
    description: 'Finance stock ticker',
    tags: ['finance', 'stocks', 'trading', 'market'],
    props: ['stocks', 'onStockClick'],
    useCases: ['Trading', 'Finance', 'Stock market']
  },
  {
    name: 'CoursePlayer',
    category: 'Industry-Specific',
    description: 'E-learning course player',
    tags: ['education', 'course', 'lessons', 'learning'],
    props: ['lessons', 'currentLesson', 'onComplete'],
    useCases: ['E-learning', 'Courses', 'Training']
  },
  {
    name: 'ProductConfigurator',
    category: 'Industry-Specific',
    description: 'E-commerce product configurator',
    tags: ['e-commerce', 'product', 'configuration', 'options'],
    props: ['product', 'options', 'onAddToCart'],
    useCases: ['E-commerce', 'Product customization', 'Shopping']
  },
  {
    name: 'PropertyViewer',
    category: 'Industry-Specific',
    description: 'Real estate property viewer',
    tags: ['real estate', 'property', 'listing', 'tour'],
    props: ['property', 'images', 'onScheduleTour'],
    useCases: ['Real estate', 'Property listings', 'Tours']
  },

  // ===== BUILDER =====
  {
    name: 'ComponentBuilder',
    category: 'Builder',
    description: 'Visual component composition tool',
    tags: ['builder', 'visual', 'composition', 'drag-drop'],
    props: ['availableComponents', 'onSave'],
    useCases: ['No-code builders', 'Page builders', 'UI composition']
  },
  {
    name: 'TemplateGallery',
    category: 'Builder',
    description: 'Pre-built template gallery',
    tags: ['templates', 'gallery', 'presets', 'starter'],
    props: ['templates', 'onUseTemplate'],
    useCases: ['Quick start', 'Templates', 'Presets']
  },
  {
    name: 'DynamicFormBuilder',
    category: 'Builder',
    description: 'Build forms at runtime',
    tags: ['form', 'builder', 'dynamic', 'generator'],
    props: ['onBuild', 'fieldTypes'],
    useCases: ['Dynamic forms', 'Survey builders', 'Form generators']
  },
];

// ============================================================================
// COMPONENT SELECTOR UI
// ============================================================================

export const ComponentSelector: React.FC<{
  onComponentSelect?: (component: ComponentInfo) => void;
  selectedCategory?: string;
}> = ({ onComponentSelect, selectedCategory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategory || 'All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(COMPONENT_CATALOG.map(c => c.category)))];

  // Get all unique tags
  const allTags = Array.from(new Set(COMPONENT_CATALOG.flatMap(c => c.tags))).sort();

  // Filter components
  const filteredComponents = useMemo(() => {
    return COMPONENT_CATALOG.filter(component => {
      // Category filter
      if (activeCategory !== 'All' && component.category !== activeCategory) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = component.name.toLowerCase().includes(query);
        const matchesDescription = component.description.toLowerCase().includes(query);
        const matchesTags = component.tags.some(tag => tag.toLowerCase().includes(query));
        const matchesUseCases = component.useCases.some(uc => uc.toLowerCase().includes(query));
        
        if (!matchesName && !matchesDescription && !matchesTags && !matchesUseCases) {
          return false;
        }
      }

      // Tag filter
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every(tag => component.tags.includes(tag));
        if (!hasAllTags) {
          return false;
        }
      }

      return true;
    });
  }, [activeCategory, searchQuery, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="component-selector bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Component Library</h1>
          <p className="text-gray-600">
            Browse 150+ universal components. Select by category, search, or filter by tags.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search components by name, description, tags, or use case..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Tabs */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
              {category === 'All' && (
                <span className="ml-2 text-sm opacity-75">({COMPONENT_CATALOG.length})</span>
              )}
              {category !== 'All' && (
                <span className="ml-2 text-sm opacity-75">
                  ({COMPONENT_CATALOG.filter(c => c.category === category).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Popular Tags */}
        {selectedTags.length === 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Popular Tags:</h3>
            <div className="flex gap-2 flex-wrap">
              {['button', 'animation', '3d', 'game', 'chart', 'form', 'table', 'mobile', 'payment', 'auth'].map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-600">Active filters:</span>
              {selectedTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  #{tag} ×
                </button>
              ))}
              <button
                onClick={() => setSelectedTags([])}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Clear all
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Found {filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''}
        </div>

        {/* Component Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredComponents.map(component => (
            <div
              key={component.name}
              className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
              onClick={() => onComponentSelect?.(component)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">{component.name}</h3>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                  {component.category}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-3">{component.description}</p>

              <div className="mb-3">
                <div className="text-xs font-semibold text-gray-500 mb-1">Tags:</div>
                <div className="flex gap-1 flex-wrap">
                  {component.tags.slice(0, 4).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {component.tags.length > 4 && (
                    <span className="px-2 py-0.5 text-xs text-gray-500">
                      +{component.tags.length - 4}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <div className="text-xs font-semibold text-gray-500 mb-1">Use Cases:</div>
                <div className="text-xs text-gray-600">
                  {component.useCases.slice(0, 3).join(', ')}
                  {component.useCases.length > 3 && '...'}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-500 mb-1">Props:</div>
                <div className="text-xs text-gray-600 font-mono">
                  {component.props.slice(0, 3).join(', ')}
                  {component.props.length > 3 && '...'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredComponents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No components found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
                setSelectedTags([]);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentSelector;
