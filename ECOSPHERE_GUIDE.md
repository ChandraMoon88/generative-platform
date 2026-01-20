# EcoSphere: Environmental Restoration Game

## Overview

**EcoSphere** is an innovative environmental restoration game integrated into the Generative Platform. Players restore struggling ecosystems while unknowingly designing their perfect environmental management application through gameplay.

## Game Concept

Players take on the role of a "Restoration Architect" chosen to help heal EcoSphere - a beautiful planet facing environmental challenges. Every action, decision, and strategy in the game secretly defines how a real environmental management application will work.

### The Magic

- **Players never see forms or technical specifications**
- **They only experience restoration gameplay**
- **But every action maps to application logic:**
  - Scanning water quality → Defining entity properties & data types
  - Creating restoration plans → Building workflows & state machines
  - Managing resources → Inventory & budget tracking systems
  - Executing projects → Transaction processing & exception handling
  - Monitoring progress → Dashboard design & data visualization

## Game Phases

### Phase 1: Landing Zone Selection (Level 1)

Players choose their starting domain from 6 environmental zones:

1. **🌊 The Weeping River Valley** → Water Quality Management System
2. **🌲 The Silent Forest** → Biodiversity & Habitat Management
3. **🏙️ The Choking City** → Urban Environmental Management
4. **🌾 The Barren Fields** → Soil & Agriculture Management
5. **🏖️ The Dying Coast** → Marine & Coastal Management
6. **⛰️ The Wounded Mountains** → Land Restoration & Mining Remediation

This choice defines the primary entity type for their application.

### Level 1: Discovery Mode - First Contact

**What Players Do:**
- Use the Environmental Scanner to examine water quality
- Walk along river sections taking measurements
- Discover pH levels, pollution, dissolved oxygen, turbidity
- Name their river and track sections

**What's Actually Generated:**
```typescript
Entity: WaterSource {
  properties: [
    { name: 'temperature', type: 'number', validation: '32-100°F' },
    { name: 'pH', type: 'number', validation: '0-14, alert if outside 6.5-8.5' },
    { name: 'dissolvedOxygen', type: 'number', unit: 'mg/L' },
    { name: 'turbidity', type: 'number', unit: 'NTU' },
    { name: 'pollutantLevel', type: 'enum', values: ['none', 'low', 'medium', 'high', 'critical'] }
  ],
  uiPatterns: ['geographic-visualization', 'data-collection-forms', 'real-time-scanning']
}
```

### Level 2: Investigation - The Source of Sorrow

**What Players Do:**
- Use Pollution Tracker to find pollution sources
- Document each source (industrial, agricultural, urban, illegal, natural)
- Collect evidence (photographs, measurements, samples, interviews)
- Prioritize sources using a 2x2 matrix (Impact vs. Feasibility)

**What's Actually Generated:**
```typescript
Entity: PollutionSource {
  properties: [
    sourceType, severity (1-10), frequency, pollutants[],
    responsibility, accessibility, priority
  ],
  relationships: {
    WaterSource: 'hasMany PollutionSources'
  },
  businessLogic: [
    { type: 'prioritization-algorithm', criteria: ['impact', 'feasibility'] },
    { type: 'attachment-system', supports: ['documents', 'photos', 'samples'] }
  ]
}
```

### Level 3: Planning - The Grand Plan

**What Players Do:**
- Design restoration strategy on Planning Canvas
- Drag action cards onto timeline
- Connect actions with dependencies
- Allocate resources (budget, team, equipment)
- Set success metrics for each action
- Choose strategic approach: Sequential (focused) vs. Parallel (comprehensive)

**What's Actually Generated:**
```typescript
Workflow: RestorationPlan {
  steps: WorkflowStep[],
  dependencies: DirectedAcyclicGraph,
  resourceAllocation: {
    budget: tracking system,
    team: capacity planning,
    equipment: inventory management
  },
  successCriteria: {
    measurements: string[],
    targets: number[],
    verification: protocols[]
  },
  architecture: approach === 'sequential' ? 'single-domain' : 'multi-domain'
}
```

### Level 4: Execution - Making It Real

**What Players Do:**
- Monitor active restoration actions in real-time
- Respond to unexpected events (delays, budget overruns, resistance)
- Collect scheduled monitoring data
- Manage team member workload and burnout
- Watch river health improve with live visualizations

**What's Actually Generated:**
```typescript
Systems: {
  realTimeMonitoring: {
    liveDataFeeds: true,
    visualizations: ['metrics', 'trends', 'heat-maps'],
    alerts: { thresholds: configurable }
  },
  exceptionHandling: {
    delayDetection: true,
    optionPresentation: true,
    cascadeImpactCalculation: true
  },
  stateManagement: {
    workflowTransitions: true,
    cascadeTriggers: true,
    conditionalActivation: true
  }
}
```

### Level 5: Systems Thinking - The Ripple Effect

**What Players Do:**
- Discover connected ecosystems (wetlands, groundwater, downstream lake)
- Map entity relationships and dependencies
- Document cascade effects and impacts
- Create stakeholder impact profiles
- Choose expansion strategy

**What's Actually Generated:**
```typescript
RelationshipArchitecture: {
  entities: {
    WaterSource, GroundwaterSystem, WetlandArea, 
    CommunityWells, AgriculturalField, WildlifeHabitat
  },
  relationships: {
    DirectFlow: { from: 'river', to: 'lake' },
    Exchange: { between: ['river', 'groundwater'], bidirectional: true },
    Dependency: { from: 'wells', to: 'groundwater' }
  },
  impactModeling: {
    cascadeEffects: true,
    multiHopRelationships: true,
    severityWeighting: true,
    temporalProjections: true
  }
}
```

### Level 6: Team Building - Collaboration Begins

**What Players Do:**
- Hire specialists (water quality expert, hydrologist, soil scientist, etc.)
- Assign team members to tasks based on skills
- Manage team dynamics and compatibility
- Schedule resources on calendar view
- Solve emergency scenarios with limited resources

**What's Actually Generated:**
```typescript
UserManagement: {
  TeamMember: {
    role: enum,
    skills: Map<skill, proficiency>,
    costPerMonth: number,
    availability: hours,
    personalityTraits: string[],
    experience: number,
    morale: number
  },
  businessLogic: {
    skillMatching: algorithm,
    qualityCalculation: f(skills, experience, compatibility),
    timeCalculation: f(baseTime, skills, teamSize, compatibility),
    conflictDetection: temporalOverlap,
    collaborationBonuses: percentage
  },
  features: {
    multiPersonTaskAssignment: true,
    calendarManagement: true,
    performanceTracking: true,
    skillProgression: true
  }
}
```

### Level 7: Budget Master - Financial Management

**What Players Do:**
- Review and categorize all expenses
- Create budget forecasts and scenarios
- Apply for grant funding
- Generate financial reports with variance analysis
- Find cost optimization opportunities

**What's Actually Generated:**
```typescript
FinancialSystem: {
  entities: {
    Expense: { category, project, amount, vendor, period },
    Budget: { total, spent, remaining, burnRate },
    BudgetScenario: { name, expenses[], projectedOutcome },
    GrantOpportunity: { searchable, filterable, deadline tracking }
  },
  features: {
    expenseTracking: true,
    burnRateCalculation: true,
    scenarioModeling: true,
    varianceAlerts: { threshold: '10%' },
    reportGeneration: automatic,
    costOptimization: recommendations
  }
}
```

### Level 8: Data Scientist - Advanced Analytics

**What Players Do:**
- Discover patterns in collected data (time-series, correlations)
- Create custom visualizations (heat maps, scatter plots, line charts)
- Build predictive models for future outcomes
- Detect anomalies and data quality issues
- Design dashboards for stakeholders

**What's Actually Generated:**
```typescript
AnalyticsSystem: {
  features: {
    timeSeriesAnalysis: true,
    patternRecognition: true,
    multiVariableCorrelation: true,
    customVisualizationBuilder: {
      chartTypes: ['line', 'bar', 'scatter', 'heatmap', 'gauge'],
      dragAndDropConfiguration: true
    },
    predictiveModeling: {
      trendExtrapolation: true,
      scenarioPlanning: true,
      confidenceIntervals: true
    },
    anomalyDetection: {
      outlierIdentification: true,
      dataQualityValidation: true,
      auditTrail: true
    },
    dashboardDesigner: {
      metricSelection: true,
      layoutDragAndDrop: true,
      autoRefresh: configurable,
      roleBasedAccess: true
    }
  }
}
```

## Player Types & Generated Applications

### The Detail Perfectionist
- Tracks dozens of parameters
- Sets up elaborate alerting
- Creates detailed reports
- Builds predictive models

**Generates:** Comprehensive Environmental Monitoring System with deep analytics, extensive tracking, predictive capabilities, and detailed reporting.

### The Empire Builder
- Manages multiple projects simultaneously
- Builds connections between ecosystems
- Coordinates teams across projects
- Tracks high-level metrics

**Generates:** Multi-Domain Environmental Management Platform with portfolio management, cross-system integration, resource optimization, and executive dashboards.

### The Community Organizer
- Invites collaboration
- Assigns roles and responsibilities
- Creates communication channels
- Builds shareable templates

**Generates:** Collaborative Environmental Action Platform with team management, role-based permissions, communication tools, and knowledge sharing.

### The Efficiency Expert
- Finds cost-effective methods
- Automates monitoring and reporting
- Creates reusable templates
- Tracks ROI and efficiency metrics

**Generates:** Environmental Project Optimization System with cost analysis, automation, recommendation engines, and efficiency tracking.

### The Scientist
- Designs controlled experiments
- Collects extensive data
- Compares methods systematically
- Documents everything meticulously

**Generates:** Environmental Research and Analysis Platform with experiment design, statistical analysis, modeling capabilities, and comprehensive documentation.

## Technical Implementation

### Database Schema

```sql
-- Core environmental entities
CREATE TABLE water_sources (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  overall_health TEXT CHECK(overall_health IN ('critical', 'polluted', 'at-risk', 'healthy')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE water_sections (
  id TEXT PRIMARY KEY,
  water_source_id TEXT NOT NULL,
  section_number INTEGER NOT NULL,
  temperature REAL,
  ph REAL,
  dissolved_oxygen REAL,
  turbidity REAL,
  pollutant_level TEXT,
  latitude REAL,
  longitude REAL,
  created_at INTEGER NOT NULL
);

CREATE TABLE pollution_sources (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  source_type TEXT,
  severity INTEGER CHECK(severity BETWEEN 1 AND 10),
  frequency TEXT,
  pollutants TEXT,
  responsibility TEXT,
  accessibility TEXT,
  priority INTEGER,
  created_at INTEGER NOT NULL
);

CREATE TABLE restoration_plans (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  approach TEXT CHECK(approach IN ('sequential', 'parallel')),
  total_budget REAL,
  total_duration INTEGER,
  created_at INTEGER NOT NULL
);

CREATE TABLE workflow_steps (
  id TEXT PRIMARY KEY,
  plan_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  action_type TEXT,
  estimated_duration INTEGER,
  estimated_cost REAL,
  prerequisites TEXT,
  success_criteria TEXT,
  risk_factors TEXT,
  status TEXT DEFAULT 'planned',
  created_at INTEGER NOT NULL
);

CREATE TABLE team_members (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  specialty TEXT,
  skills TEXT,
  cost_per_month REAL,
  availability TEXT,
  personality_traits TEXT,
  experience INTEGER DEFAULT 0,
  morale INTEGER DEFAULT 100,
  created_at INTEGER NOT NULL
);
```

### API Endpoints

```
# Water Sources
GET    /api/ecosphere/water-sources/:projectId
POST   /api/ecosphere/water-sources
PATCH  /api/ecosphere/water-sources/:sourceId/health

# Water Sections
GET    /api/ecosphere/water-sections/:waterSourceId
POST   /api/ecosphere/water-sections

# Pollution Sources
GET    /api/ecosphere/pollution-sources/:projectId
POST   /api/ecosphere/pollution-sources

# Restoration Plans
GET    /api/ecosphere/restoration-plans/:projectId
POST   /api/ecosphere/restoration-plans

# Workflow Steps
GET    /api/ecosphere/workflow-steps/:planId
POST   /api/ecosphere/workflow-steps
PATCH  /api/ecosphere/workflow-steps/:stepId/status

# Team Members
GET    /api/ecosphere/team-members/:projectId
POST   /api/ecosphere/team-members
```

### Frontend Components

- `EcoSphereGame.tsx` - Main game component with all 8 levels
- `Level1Discovery` - Water scanning and data collection
- `Level2Investigation` - Pollution source identification
- `Level3Planning` - Restoration strategy design
- (Additional level components to be implemented)

### Integration with Existing Platform

EcoSphere is integrated into the existing `GameFlow.tsx` component. Players can choose between:
1. **EcoSphere Journey** - Full environmental restoration game
2. **Demo Mode** - See example restaurant application

The game generates application models that are converted to components using the existing code generation system.

## Usage

### Starting EcoSphere

```tsx
// From GameFlow.tsx
<EcoSphereGame 
  onGameComplete={(appModel) => {
    // App model contains:
    // - entities: discovered environmental entities
    // - relationships: entity relationships and dependencies
    // - workflows: restoration plan workflows
    // - businessLogic: prioritization, validation, calculations
    // - uiPatterns: visualization and interaction patterns
    // - architecture: single-domain vs multi-domain
    
    // Convert to components
    const components = convertAppModelToComponents(appModel);
    onAppCreated(components);
  }}
/>
```

### Saving Progress

Game progress is automatically saved to localStorage:

```typescript
localStorage.setItem('ecosphere-progress', JSON.stringify({
  phase: 'level-3-planning',
  level: 3,
  selectedZone: 'river-valley',
  restorationPoints: 850,
  unlockedAbilities: ['water-scanner', 'pollution-tracker', 'planner'],
  playTime: 1847, // seconds
  generatedAppModel: { /* ... */ }
}));
```

### Accessing Generated Data

All gameplay data is saved to the database and associated with the project:

```typescript
// Fetch player's water sources
const sources = await fetch(`/api/ecosphere/water-sources/${projectId}`);

// Fetch restoration plans
const plans = await fetch(`/api/ecosphere/restoration-plans/${projectId}`);

// Fetch team members
const team = await fetch(`/api/ecosphere/team-members/${projectId}`);
```

## Design Philosophy

### The Genius of This Approach

1. **No Forms, Only Experience** - Players never fill out requirement forms
2. **Natural Discovery** - Data models emerge from exploration
3. **Meaningful Choices** - Every decision has visible impact in the game
4. **Emotional Investment** - Players care about their river, forest, or coast
5. **Unconscious Design** - Application architecture forms naturally from playstyle
6. **Perfect Fit** - The generated app reflects how the user actually thinks

### The Secret Sauce

Players become completely absorbed because:
- **Beautiful** visuals of ecosystems healing
- **Meaningful** environmental restoration feels important  
- **Creative** infinite ways to solve challenges
- **Strategic** deep resource management and planning
- **Social** collaboration and competition potential
- **Progressive** always new challenges and capabilities
- **Satisfying** visible impact from actions

But they're actually demonstrating:
- Data modeling through ecosystem assessment
- Workflow design through restoration planning
- Resource management through budget allocation
- Business logic through rules and validations
- Analytics through monitoring and reporting
- Integration through ecosystem connections
- Collaboration through team features
- Optimization through efficiency improvements

## Future Enhancements

### Phase 2 Features (Levels 9-15)
- Advanced team dynamics and skill trees
- Multi-region restoration campaigns
- Competitive leaderboards
- Shared restoration challenges
- Custom tool creation
- AI-powered recommendations

### Phase 3 Features (Levels 16-25)
- Global environmental policy influence
- Revolutionary restoration techniques
- Mentorship system for new players
- Marketplace for resources and expertise
- Alliance system for massive projects
- Legacy building and long-term impact

### Generated Application Types

Future support for:
- Climate Change Tracking Systems
- Carbon Credit Management Platforms
- Renewable Energy Project Managers
- Sustainable Agriculture Platforms
- Wildlife Conservation Systems
- Urban Planning & Green Infrastructure
- Environmental Compliance Trackers
- Ecosystem Services Valuation Tools

## Contributing

EcoSphere is part of the Generative Platform. Contributions should maintain the core principle: **players should never see the application being built**.

Key guidelines:
- All game mechanics must map to clear application patterns
- Maintain the narrative and emotional engagement
- Ensure gameplay is fun and meaningful independent of app generation
- Document new entity types and workflows clearly
- Test that generated applications are actually useful

## License

Part of the Generative Platform project.

---

**"They never knew they were building. They only knew they were restoring a world. And in doing so, they built exactly the tool they needed to restore the real one."**
