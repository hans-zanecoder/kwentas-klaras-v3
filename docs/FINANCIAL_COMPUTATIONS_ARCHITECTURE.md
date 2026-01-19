# Financial Computations Architecture

## Source of Truth

**`ComputationService` (Backend) is the authoritative source of truth** for all financial calculations.

## Architecture Overview

### Backend Layer (Source of Truth)
- **Location**: `server/services/computation/ComputationService.ts`
- **Purpose**: Centralized server-side financial calculations
- **Used By**:
  - `ProjectService` - For project listing and details
  - `ObligationService` - For obligation calculations
  - `DisbursementService` - For disbursement calculations
  - `GraphsService` - For graph data calculations
  - API endpoints: `/api/projects/reports`, `/api/projects/bulk-export`

### Frontend Layer (Client-Side Calculations)
- **Location**: `app/composables/project/useProjectFinancials.ts`
- **Purpose**: Real-time client-side calculations for UI responsiveness
- **Used By**:
  - `useProjectListFinancials` - For project list view
  - Project detail pages - For real-time financial displays

## Calculation Formulas (Must Match Exactly)

### Total Budget
```typescript
// Backend & Frontend
totalBudget = appropriation + totalAddedBudget
```

### Remaining Balance
```typescript
// Backend
remainingBalance = appropriation + totalAddedBudget - totalDisbursements

// Frontend (equivalent)
remainingBalance = totalBudget - totalDisbursements
```

### Utilization Rate
```typescript
// Backend & Frontend
if (totalBudget === 0) return 0
utilizationRate = (approvedDisbursements / totalBudget) * 100
```

### Remaining Obligations
```typescript
// Backend & Frontend
remainingObligations = Math.max(0, totalObligations - approvedDisbursements)
```

## Best Practices

1. **Backend is authoritative**: All calculation logic should be defined in `ComputationService` first
2. **Frontend mirrors backend**: Frontend calculations must match backend formulas exactly
3. **Documentation**: When updating calculations, update both backend and frontend
4. **Testing**: Test calculations in both backend and frontend to ensure consistency

## When to Use Each

### Use Backend (`ComputationService`) When:
- ✅ Generating reports
- ✅ Bulk exports
- ✅ Server-side data processing
- ✅ API responses that need computed values
- ✅ Data integrity is critical

### Use Frontend (`useProjectFinancials`) When:
- ✅ Real-time UI updates
- ✅ Interactive financial displays
- ✅ Client-side filtering/sorting
- ✅ Performance optimization (avoiding API calls)

## Maintenance Guidelines

1. **Always update `ComputationService` first** when changing calculation logic
2. **Then update `useProjectFinancials`** to match the backend logic
3. **Add comments** in frontend code referencing the backend source
4. **Test both** to ensure consistency

## Current Status

✅ **Formulas are synchronized** - Backend and frontend calculations match exactly.
